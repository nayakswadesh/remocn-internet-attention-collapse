import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const inputPath = path.resolve(process.argv[2] ?? 'out/phase5.5/internet-attention-full-mix.wav');
const outputRoot = path.resolve('out/phase5.5/diagnostics');
const outputName = path.basename(inputPath, path.extname(inputPath));
const buffer = await readFile(inputPath);
const fmt = buffer.indexOf('fmt ');
const data = buffer.indexOf('data');
if (fmt < 0 || data < 0) throw new Error('Invalid WAV');
const channels = buffer.readUInt16LE(fmt + 10);
const sampleRate = buffer.readUInt32LE(fmt + 12);
const bits = buffer.readUInt16LE(fmt + 22);
const dataSize = buffer.readUInt32LE(data + 4);
if (bits !== 16) throw new Error('Expected 16-bit WAV');
const start = data + 8;
const frames = dataSize / (channels * 2);

const sections = [
  ['hook', 0, 3.5],
  ['old-internet', 3.5, 11],
  ['harlem', 11, 18.5],
  ['exceptions', 18.5, 27],
  ['modern', 27, 37],
  ['overload', 37, 40.6],
  ['silence', 40.6, 41.3],
  ['reflection', 41.3, 46],
  ['payoff', 46, 49],
  ['loop', 49, 50],
];

const sampleAt = (frame, channel) => buffer.readInt16LE(start + (frame * channels + channel) * 2) / 32768;
const metricsForRange = (fromSeconds, toSeconds) => {
  const from = Math.floor(fromSeconds * sampleRate);
  const to = Math.min(frames, Math.floor(toSeconds * sampleRate));
  let peak = 0;
  let sumSquares = 0;
  let count = 0;
  for (let frame = from; frame < to; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const value = sampleAt(frame, channel);
      peak = Math.max(peak, Math.abs(value));
      sumSquares += value * value;
      count++;
    }
  }
  const rms = Math.sqrt(sumSquares / count);
  return {
    peak,
    peakDbfs: 20 * Math.log10(Math.max(peak, 1e-9)),
    rms,
    rmsDbfs: 20 * Math.log10(Math.max(rms, 1e-9)),
  };
};

let clippedSamples = 0;
for (let frame = 0; frame < frames; frame++) {
  for (let channel = 0; channel < channels; channel++) {
    if (Math.abs(sampleAt(frame, channel)) >= 0.999) clippedSamples++;
  }
}

const seamDelta = Array.from({length: channels}, (_, channel) =>
  Math.abs(sampleAt(frames - 1, channel) - sampleAt(0, channel)),
);
const report = {
  file: inputPath,
  sampleRate,
  channels,
  durationSeconds: frames / sampleRate,
  clippedSamples,
  seamDelta,
  overall: metricsForRange(0, frames / sampleRate),
  sections: Object.fromEntries(sections.map(([name, from, to]) => [name, metricsForRange(from, to)])),
};

const width = 1200;
const height = 360;
const bins = 600;
const points = [];
for (let bin = 0; bin < bins; bin++) {
  const from = Math.floor(bin / bins * frames);
  const to = Math.floor((bin + 1) / bins * frames);
  let peak = 0;
  for (let frame = from; frame < to; frame++) {
    peak = Math.max(peak, Math.abs(sampleAt(frame, 0)), Math.abs(sampleAt(frame, 1)));
  }
  const x = bin / (bins - 1) * width;
  const y = height / 2 - peak * (height * 0.44);
  points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
}
const lower = [...points].reverse().map((point) => {
  const [x, y] = point.split(',').map(Number);
  return `${x.toFixed(2)},${(height - y).toFixed(2)}`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#09090b"/><line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="#27272a"/><polygon points="${[...points, ...lower].join(' ')}" fill="#22d3ee" fill-opacity="0.72"/></svg>`;

const rowStride = Math.ceil(width * 3 / 4) * 4;
const pixelBytes = rowStride * height;
const bmp = Buffer.alloc(54 + pixelBytes);
bmp.write('BM', 0);
bmp.writeUInt32LE(54 + pixelBytes, 2);
bmp.writeUInt32LE(54, 10);
bmp.writeUInt32LE(40, 14);
bmp.writeInt32LE(width, 18);
bmp.writeInt32LE(height, 22);
bmp.writeUInt16LE(1, 26);
bmp.writeUInt16LE(24, 28);
bmp.writeUInt32LE(pixelBytes, 34);
const setPixel = (x, y, red, green, blue) => {
  const row = height - 1 - y;
  const offset = 54 + row * rowStride + x * 3;
  bmp[offset] = blue;
  bmp[offset + 1] = green;
  bmp[offset + 2] = red;
};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) setPixel(x, y, 9, 9, 11);
}
for (let x = 0; x < width; x++) setPixel(x, Math.floor(height / 2), 39, 39, 42);
for (let x = 0; x < width; x++) {
  const from = Math.floor(x / width * frames);
  const to = Math.max(from + 1, Math.floor((x + 1) / width * frames));
  let peak = 0;
  for (let frame = from; frame < to; frame++) {
    peak = Math.max(peak, Math.abs(sampleAt(frame, 0)), Math.abs(sampleAt(frame, 1)));
  }
  const extent = Math.max(1, Math.round(peak * height * 0.44));
  for (let y = Math.floor(height / 2) - extent; y <= Math.floor(height / 2) + extent; y++) {
    setPixel(x, y, 34, 211, 238);
  }
}

await mkdir(outputRoot, {recursive: true});
await writeFile(path.join(outputRoot, `${outputName}-analysis.json`), JSON.stringify(report, null, 2));
await writeFile(path.join(outputRoot, `${outputName}-waveform.svg`), svg);
await writeFile(path.join(outputRoot, `${outputName}-waveform.bmp`), bmp);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
