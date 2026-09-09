import {describe, expect, it} from 'vitest';
import {AUDIO_CUES} from '../src/lib/audioCues';
import {BEAT_TIMING, SCENE_TIMING, VIDEO_CONFIG} from '../src/lib/timing';

describe('scene timing', () => {
  it('covers the full composition with contiguous, non-overlapping scenes', () => {
    const scenes = Object.values(SCENE_TIMING);

    expect(scenes[0]?.start).toBe(0);

    for (let index = 1; index < scenes.length; index++) {
      expect(scenes[index]?.start).toBe(scenes[index - 1]?.endExclusive);
    }

    expect(scenes.at(-1)?.endExclusive).toBe(VIDEO_CONFIG.durationInFrames);
    expect(
      scenes.reduce((total, current) => total + current.duration, 0),
    ).toBe(VIDEO_CONFIG.durationInFrames);
  });

  it('keeps every named beat and optional audio cue inside the composition', () => {
    const beatFrames = Object.values(BEAT_TIMING).flatMap((sceneBeats) =>
      Object.values(sceneBeats),
    );

    for (const frame of [...beatFrames, ...AUDIO_CUES.map((cue) => cue.frame)]) {
      expect(frame).toBeGreaterThanOrEqual(0);
      expect(frame).toBeLessThan(VIDEO_CONFIG.durationInFrames);
    }
  });
});
