import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const inputPath = path.resolve('out/phase5.5/internet-attention-full-mix.wav');
const outputPath = path.resolve('out/phase5.5/internet-attention-loop-test.wav');
const input = await readFile(inputPath);
const fmt = input.indexOf('fmt ');
const data = input.indexOf('data');
if (fmt < 0 || data < 0) throw new Error('Invalid input WAV');
const channels = input.readUInt16LE(fmt + 10);
const sampleRate = input.readUInt32LE(fmt + 12);
const bytesPerFrame = channels * 2;
const dataStart = data + 8;
const sampleAtFrame = (frame) => dataStart + frame * bytesPerFrame;
const tailStart = Math.round(1420 / 30 * sampleRate);
const tailEnd = Math.round(1500 / 30 * sampleRate);
const headEnd = Math.round(120 / 30 * sampleRate);
const chunks = [
  input.subarray(sampleAtFrame(tailStart), sampleAtFrame(tailEnd)),
  input.subarray(dataStart, sampleAtFrame(headEnd)),
];
const pcm = Buffer.concat(chunks);
const output = Buffer.allocUnsafe(44 + pcm.length);
output.write('RIFF', 0);
output.writeUInt32LE(36 + pcm.length, 4);
output.write('WAVE', 8);
output.write('fmt ', 12);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(channels, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * bytesPerFrame, 28);
output.writeUInt16LE(bytesPerFrame, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(pcm.length, 40);
pcm.copy(output, 44);
await writeFile(outputPath, output);
process.stdout.write(`Created ${(pcm.length / bytesPerFrame / sampleRate).toFixed(3)}-second loop-test WAV.\n`);
