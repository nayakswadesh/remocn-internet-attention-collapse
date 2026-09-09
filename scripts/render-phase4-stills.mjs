import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const frames = [
  530, 554, 555, 560, 570, 620, 670, 720, 742, 770, 805, 809, 810, 820,
  830, 880, 930, 980, 995, 1030, 1080, 1100, 1109, 1110, 1120, 1160,
  1175, 1200, 1217, 1218, 1229,
];

const renderBatch = async ({serveUrl, composition, scale, outputDirectory}) => {
  await mkdir(outputDirectory, {recursive: true});

  for (let index = 0; index < frames.length; index += 4) {
    const batch = frames.slice(index, index + 4);
    await Promise.all(
      batch.map((frame) =>
        renderStill({
          composition,
          serveUrl,
          frame,
          imageFormat: 'png',
          scale,
          overwrite: true,
          output: path.join(outputDirectory, `frame-${String(frame).padStart(4, '0')}.png`),
          logLevel: 'warn',
        }),
      ),
    );
  }
};

const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  onProgress: () => undefined,
});
const composition = await selectComposition({
  serveUrl,
  id: 'InternetAttentionCollapse',
  logLevel: 'warn',
});

await renderBatch({
  serveUrl,
  composition,
  scale: 1,
  outputDirectory: path.resolve('out/phase4/stills'),
});
await renderBatch({
  serveUrl,
  composition,
  scale: 0.25,
  outputDirectory: path.resolve('out/phase4/phone-stills'),
});

process.stdout.write(`Rendered ${frames.length * 2} Phase 4 inspection stills.\n`);
