import {readFileSync} from 'node:fs';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  AUDIO_ASSETS,
  AUDIO_LEVELS,
  musicLevelAtFrame,
  NARRATION_SEGMENTS,
  narrationActivityAtFrame,
} from '../src/lib/audioMix';
import {VIDEO_CONFIG} from '../src/lib/timing';

describe('Phase 5.5 audio architecture', () => {
  it('keeps narration ordered, non-overlapping, and inside the composition', () => {
    for (let index = 0; index < NARRATION_SEGMENTS.length; index++) {
      const segment = NARRATION_SEGMENTS[index];
      expect(segment).toBeDefined();
      expect(segment?.startFrame).toBeGreaterThanOrEqual(0);
      expect(segment?.endFrame).toBeLessThanOrEqual(VIDEO_CONFIG.durationInFrames);
      expect(segment?.endFrame).toBeGreaterThan(segment?.startFrame ?? 0);
      if (index > 0) {
        expect(segment?.startFrame).toBeGreaterThanOrEqual(
          NARRATION_SEGMENTS[index - 1]?.endFrame ?? 0,
        );
      }
    }
  });

  it('ducks music during voice and restores it outside narration', () => {
    const voiceFrame = NARRATION_SEGMENTS[1]?.startFrame ?? 0;
    expect(narrationActivityAtFrame(voiceFrame + AUDIO_LEVELS.duckFadeFrames)).toBe(1);
    expect(musicLevelAtFrame(voiceFrame + 10, true)).toBeLessThan(
      AUDIO_LEVELS.musicWithVoice,
    );
    expect(musicLevelAtFrame(1200, true)).toBe(AUDIO_LEVELS.musicWithVoice);
  });

  it('resolves every runtime stem to a local 50-second PCM WAV', () => {
    for (const asset of Object.values(AUDIO_ASSETS)) {
      expect(asset).not.toMatch(/^https?:/);
      const wav = readFileSync(path.resolve('public', asset));
      expect(wav.toString('ascii', 0, 4)).toBe('RIFF');
      expect(wav.toString('ascii', 8, 12)).toBe('WAVE');
      expect(wav.readUInt16LE(22)).toBe(2);
      expect(wav.readUInt32LE(24)).toBe(48000);
      expect(wav.readUInt16LE(34)).toBe(16);
      expect(wav.readUInt32LE(40)).toBe(50 * 48000 * 2 * 2);
    }
  });
});
