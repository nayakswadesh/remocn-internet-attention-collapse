import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const mainFrames = [0, 1230, 1270, 1320, 1370, 1390, 1420, 1450, 1470, 1490, 1499];
const loopFrames = [78, 79, 80, 81, 110];

const renderBatch = async ({serveUrl, composition, frames, scale, outputDirectory}) => {
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
const mainComposition = await selectComposition({
  serveUrl,
  id: 'InternetAttentionCollapse',
  logLevel: 'warn',
});
const loopComposition = await selectComposition({
  serveUrl,
  id: 'InternetAttentionLoopTest',
  logLevel: 'warn',
});

await renderBatch({
  serveUrl,
  composition: mainComposition,
  frames: mainFrames,
  scale: 1,
  outputDirectory: path.resolve('out/phase5/stills'),
});
await renderBatch({
  serveUrl,
  composition: mainComposition,
  frames: mainFrames,
  scale: 0.25,
  outputDirectory: path.resolve('out/phase5/phone-stills'),
});
await renderBatch({
  serveUrl,
  composition: loopComposition,
  frames: loopFrames,
  scale: 0.25,
  outputDirectory: path.resolve('out/phase5/loop-phone-stills'),
});

process.stdout.write(
  `Rendered ${mainFrames.length * 2 + loopFrames.length} Phase 5 inspection stills.\n`,
);
