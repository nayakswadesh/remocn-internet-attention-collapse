import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const inputPath = path.resolve(process.argv[2] ?? 'out/phase5.5/diagnostics/loop-test-decoded.wav');
const input = await readFile(inputPath);
const fmt = input.indexOf('fmt ');
const data = input.indexOf('data');
if (fmt < 0 || data < 0) throw new Error('Invalid WAV');
const channels = input.readUInt16LE(fmt + 10);
const sampleRate = input.readUInt32LE(fmt + 12);
const dataSize = input.readUInt32LE(data + 4);
const start = data + 8;
const frames = dataSize / (channels * 2);
const sampleAt = (frame, channel) => input.readInt16LE(start + (frame * channels + channel) * 2) / 32768;
const deltaAt = (frame) => Array.from({length: channels}, (_, channel) =>
  Math.abs(sampleAt(frame, channel) - sampleAt(frame - 1, channel)),
);
const joinFrame = Math.round(80 / 30 * sampleRate);
let peak = 0;
let clippedSamples = 0;
for (let frame = 0; frame < frames; frame++) {
  for (let channel = 0; channel < channels; channel++) {
    const value = Math.abs(sampleAt(frame, channel));
    peak = Math.max(peak, value);
    if (value >= 0.999) clippedSamples++;
  }
}
const report = {
  file: inputPath,
  durationSeconds: frames / sampleRate,
  sampleRate,
  channels,
  peak,
  peakDbfs: 20 * Math.log10(Math.max(peak, 1e-9)),
  clippedSamples,
  tailToHeadJoinDelta: deltaAt(joinFrame),
  repeatedTestEndToStartDelta: Array.from({length: channels}, (_, channel) =>
    Math.abs(sampleAt(frames - 1, channel) - sampleAt(0, channel)),
  ),
};
await writeFile(
  path.resolve('out/phase5.5/diagnostics/loop-test-analysis.json'),
  JSON.stringify(report, null, 2),
);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
