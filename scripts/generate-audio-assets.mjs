import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import narration from '../src/data/narration.json' with {type: 'json'};
import {BEAT_TIMING} from '../src/lib/timing.ts';

const SAMPLE_RATE = 48000;
const DURATION_SECONDS = 50;
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION_SECONDS;
const OUTPUT_ROOT = path.resolve('public/audio');
const TAU = Math.PI * 2;

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const smoothstep = (value) => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};
const hashNoise = (index) => {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};
const envelope = (time, start, duration, attack = 0.012, release = 0.2) => {
  const local = time - start;
  if (local < 0 || local >= duration) return 0;
  const inGain = smoothstep(local / Math.max(attack, 0.001));
  const outGain = smoothstep((duration - local) / Math.max(release, 0.001));
  return Math.min(inGain, outGain);
};

const createStereo = () => ({left: new Float32Array(TOTAL_SAMPLES), right: new Float32Array(TOTAL_SAMPLES)});

const addTone = (stem, {start, duration, frequency, amplitude, pan = 0, glide = 0, release = 0.2}) => {
  const from = Math.max(0, Math.floor(start * SAMPLE_RATE));
  const to = Math.min(TOTAL_SAMPLES, Math.ceil((start + duration) * SAMPLE_RATE));
  const leftGain = Math.sqrt((1 - pan) / 2);
  const rightGain = Math.sqrt((1 + pan) / 2);
  let phase = 0;

  for (let index = from; index < to; index++) {
    const time = index / SAMPLE_RATE;
    const progress = (time - start) / duration;
    const frequencyAtTime = frequency + glide * progress;
    phase += TAU * frequencyAtTime / SAMPLE_RATE;
    const gain = envelope(time, start, duration, 0.01, release);
    const sample = (Math.sin(phase) + Math.sin(phase * 2) * 0.16) * amplitude * gain;
    stem.left[index] += sample * leftGain;
    stem.right[index] += sample * rightGain;
  }
};

const normalize = (stem, peakTarget) => {
  let peak = 0;
  for (let index = 0; index < TOTAL_SAMPLES; index++) {
    peak = Math.max(peak, Math.abs(stem.left[index]), Math.abs(stem.right[index]));
  }
  const gain = peak > peakTarget ? peakTarget / peak : 1;
  if (gain < 1) {
    for (let index = 0; index < TOTAL_SAMPLES; index++) {
      stem.left[index] *= gain;
      stem.right[index] *= gain;
    }
  }
  return Math.min(peak, peakTarget);
};

const wavBuffer = (stem) => {
  const channels = 2;
  const bytesPerSample = 2;
  const dataSize = TOTAL_SAMPLES * channels * bytesPerSample;
  const buffer = Buffer.allocUnsafe(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * channels * bytesPerSample, 28);
  buffer.writeUInt16LE(channels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let index = 0; index < TOTAL_SAMPLES; index++) {
    buffer.writeInt16LE(Math.round(clamp(stem.left[index], -1, 1) * 32767), offset);
    buffer.writeInt16LE(Math.round(clamp(stem.right[index], -1, 1) * 32767), offset + 2);
    offset += 4;
  }
  return buffer;
};

const writeStem = async (name, stem, peakTarget) => {
  const peak = normalize(stem, peakTarget);
  await writeFile(path.join(OUTPUT_ROOT, name), wavBuffer(stem));
  return peak;
};

const buildMusic = () => {
  const stem = createStereo();
  const chordFrequencies = [110, 123.47, 146.83, 164.81];

  for (let index = 0; index < TOTAL_SAMPLES; index++) {
    const time = index / SAMPLE_RATE;
    const chord = chordFrequencies[Math.floor(time / 4) % chordFrequencies.length];
    let density = 1;
    let sectionGain = 0.16;

    if (time < 3.5) {
      density = 1;
      sectionGain = 0.105;
    } else if (time < 11) {
      density = 2;
      sectionGain = 0.15;
    } else if (time < 18.5) {
      density = 2 + (time - 11) * 0.45;
      sectionGain = 0.17;
    } else if (time < 24) {
      density = 4;
      sectionGain = 0.17;
    } else if (time < 27) {
      density = 1.2;
      sectionGain = 0.13;
    } else if (time < 37) {
      density = 4 + (time - 27) * 0.38;
      sectionGain = 0.18;
    } else if (time < 40.6) {
      density = 9 + (time - 37) * 0.8;
      sectionGain = 0.2;
    } else if (time < 41.3) {
      density = 1;
      sectionGain = 0.008;
    } else if (time < 46) {
      density = 0.75;
      sectionGain = 0.095 * smoothstep((time - 41.3) / 1.2);
    } else if (time < 47.55) {
      density = 0.6;
      sectionGain = 0.065;
    } else if (time < 47.74) {
      density = 0.6;
      sectionGain = 0.006;
    } else {
      density = 1;
      sectionGain = 0.07;
    }

    const pulsePhase = (time * density) % 1;
    const pulse = Math.exp(-pulsePhase * 8.5);
    const pad = Math.sin(TAU * chord * time) * 0.56 + Math.sin(TAU * chord * 1.5 * time) * 0.2;
    const mid = Math.sin(TAU * (chord * 2) * time) * pulse * 0.36;
    const side = Math.sin(TAU * (chord * 3.01) * time) * pulse * 0.12;
    stem.left[index] = (pad + mid + side) * sectionGain;
    stem.right[index] = (pad + mid - side) * sectionGain;
  }
  return stem;
};

const buildImpacts = () => {
  const stem = createStereo();
  const cues = [
    [BEAT_TIMING.coldOpen.questionImpact, 185, 0.38],
    [BEAT_TIMING.oldInternet.nyanMetric, 247, 0.22],
    [BEAT_TIMING.oldInternet.gangnamMetric, 220, 0.25],
    [BEAT_TIMING.fracture.harlemSpike, 294, 0.34],
    [BEAT_TIMING.fracture.metricReveal, 330, 0.38],
    [BEAT_TIMING.exceptions.iceMetric, 262, 0.24],
    [BEAT_TIMING.exceptions.mannequinMetric, 294, 0.24],
    [BEAT_TIMING.exceptions.counterexampleReveal, 196, 0.3],
    [BEAT_TIMING.modernCycle.trend, 330, 0.2],
    [BEAT_TIMING.modernCycle.remix, 370, 0.2],
    [BEAT_TIMING.modernCycle.saturate, 415, 0.24],
    [BEAT_TIMING.modernCycle.replace, 185, 0.34],
    [BEAT_TIMING.qualitativeMontage.viral, 330, 0.2],
    [BEAT_TIMING.qualitativeMontage.everywhere, 370, 0.22],
    [BEAT_TIMING.qualitativeMontage.overused, 415, 0.25],
    [BEAT_TIMING.qualitativeMontage.next, 165, 0.34],
    [BEAT_TIMING.payoff.attention, 220, 0.42],
  ];
  for (const [frame, frequency, amplitude] of cues) {
    addTone(stem, {start: frame / 30, duration: 0.34, frequency, amplitude, release: 0.28});
  }
  return stem;
};

const buildTransitions = () => {
  const stem = createStereo();
  const events = [
    {frame: BEAT_TIMING.fracture.timelineCompress, duration: 1.55, frequency: 180, glide: 720, amplitude: 0.2},
    {frame: BEAT_TIMING.exceptions.coffinKeepsGoing, duration: 1.25, frequency: 220, glide: -90, amplitude: 0.17},
    {frame: BEAT_TIMING.modernCycle.replace, duration: 0.65, frequency: 520, glide: -360, amplitude: 0.22},
    {frame: BEAT_TIMING.qualitativeMontage.next, duration: 0.48, frequency: 460, glide: -310, amplitude: 0.24},
    {frame: BEAT_TIMING.loop.returnToHook, duration: 0.3, frequency: 185, glide: 35, amplitude: 0.12},
  ];
  for (const event of events) {
    addTone(stem, {
      start: event.frame / 30,
      duration: event.duration,
      frequency: event.frequency,
      amplitude: event.amplitude,
      glide: event.glide,
      pan: event.glide > 0 ? 0.25 : -0.2,
      release: event.duration * 0.55,
    });
  }
  return stem;
};

const buildTexture = () => {
  const stem = createStereo();
  for (let index = 0; index < TOTAL_SAMPLES; index++) {
    const time = index / SAMPLE_RATE;
    let gain = 0.012;
    let tickRate = 1;
    if (time >= 11 && time < 18.5) tickRate = 3 + (time - 11) * 0.55;
    if (time >= 27 && time < 37) tickRate = 5.5;
    if (time >= 37 && time < 40.6) {
      tickRate = 12;
      gain = 0.026;
    }
    if (time >= 40.6 && time < 41.3) gain = 0;
    if (time >= 46) gain *= 0.45;
    const tickPhase = (time * tickRate) % 1;
    const tick = tickPhase < 0.025 ? (1 - tickPhase / 0.025) : 0;
    const noise = hashNoise(Math.floor(index / 7));
    const tone = Math.sin(TAU * 1450 * time) * tick;
    stem.left[index] = (noise * 0.2 + tone) * gain;
    stem.right[index] = (noise * 0.2 + tone * 0.86) * gain;
  }
  return stem;
};

const parsePcmWav = (buffer) => {
  const fmtOffset = buffer.indexOf('fmt ');
  const dataOffset = buffer.indexOf('data');
  if (fmtOffset < 0 || dataOffset < 0) throw new Error('Unsupported WAV structure');
  const format = buffer.readUInt16LE(fmtOffset + 8);
  const channels = buffer.readUInt16LE(fmtOffset + 10);
  const sampleRate = buffer.readUInt32LE(fmtOffset + 12);
  const bits = buffer.readUInt16LE(fmtOffset + 22);
  const dataSize = buffer.readUInt32LE(dataOffset + 4);
  if (format !== 1 || bits !== 16) throw new Error('Narration WAV must be 16-bit PCM');
  const start = dataOffset + 8;
  const frameCount = dataSize / (channels * 2);
  const samples = new Float32Array(frameCount);
  for (let frame = 0; frame < frameCount; frame++) {
    let value = 0;
    for (let channel = 0; channel < channels; channel++) {
      value += buffer.readInt16LE(start + (frame * channels + channel) * 2) / 32768;
    }
    samples[frame] = value / channels;
  }
  return {sampleRate, samples};
};

const buildVoice = async () => {
  const stem = createStereo();
  const durations = [];
  const overflows = [];
  for (const segment of narration) {
    const file = await readFile(path.join(OUTPUT_ROOT, 'voice-segments', `${segment.id}.wav`));
    const source = parsePcmWav(file);
    const durationFrames = Math.ceil(source.samples.length / source.sampleRate * 30);
    const allottedFrames = segment.endFrame - segment.startFrame;
    durations.push({id: segment.id, durationFrames, allottedFrames});
    if (durationFrames > allottedFrames) {
      overflows.push(`${segment.id}: ${durationFrames}/${allottedFrames} frames`);
    }
    const startSample = Math.floor(segment.startFrame / 30 * SAMPLE_RATE);
    const outputLength = Math.ceil(source.samples.length / source.sampleRate * SAMPLE_RATE);
    for (let outputIndex = 0; outputIndex < outputLength; outputIndex++) {
      const sourcePosition = outputIndex * source.sampleRate / SAMPLE_RATE;
      const lower = Math.floor(sourcePosition);
      const upper = Math.min(source.samples.length - 1, lower + 1);
      const mix = sourcePosition - lower;
      const sample = (source.samples[lower] ?? 0) * (1 - mix) + (source.samples[upper] ?? 0) * mix;
      const target = startSample + outputIndex;
      if (target >= TOTAL_SAMPLES) break;
      const fadeSamples = Math.floor(SAMPLE_RATE * 0.012);
      const fade = Math.min(1, outputIndex / fadeSamples, (outputLength - outputIndex) / fadeSamples);
      stem.left[target] += sample * fade;
      stem.right[target] += sample * fade;
    }
  }
  if (overflows.length > 0) {
    throw new Error(`Narration slots exceeded: ${overflows.join(', ')}`);
  }
  return {stem, durations};
};

await mkdir(OUTPUT_ROOT, {recursive: true});
const voice = await buildVoice();
const peaks = {
  music: await writeStem('music.wav', buildMusic(), 0.62),
  impacts: await writeStem('impacts.wav', buildImpacts(), 0.7),
  transitions: await writeStem('transitions.wav', buildTransitions(), 0.64),
  texture: await writeStem('texture.wav', buildTexture(), 0.42),
  voice: await writeStem('voice-placeholder.wav', voice.stem, 0.82),
};
await writeFile(
  path.join(OUTPUT_ROOT, 'generation-report.json'),
  JSON.stringify({sampleRate: SAMPLE_RATE, durationSeconds: DURATION_SECONDS, peaks, voiceDurations: voice.durations}, null, 2),
);
process.stdout.write(`Generated five deterministic 50-second audio stems at ${SAMPLE_RATE} Hz.\n`);
