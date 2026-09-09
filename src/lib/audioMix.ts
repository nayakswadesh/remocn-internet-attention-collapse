import narration from '../data/narration.json';

export type AudioLayerName =
  | 'VOICE'
  | 'MUSIC'
  | 'IMPACTS'
  | 'TRANSITIONS'
  | 'TEXTURE / AMBIENCE';

export interface NarrationSegment {
  readonly id: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly text: string;
}

export const NARRATION_SEGMENTS = narration satisfies readonly NarrationSegment[];

export const AUDIO_ASSETS = {
  voice: 'audio/voice-placeholder.wav',
  music: 'audio/music.wav',
  impacts: 'audio/impacts.wav',
  transitions: 'audio/transitions.wav',
  texture: 'audio/texture.wav',
} as const;

export const AUDIO_LEVELS = {
  voice: 0.82,
  musicWithVoice: 0.66,
  musicWithoutVoice: 0.76,
  impacts: 0.48,
  transitions: 0.42,
  texture: 0.58,
  voiceDuckRatio: 0.46,
  duckFadeFrames: 5,
} as const;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const narrationActivityAtFrame = (frame: number): number => {
  let activity = 0;
  for (const segment of NARRATION_SEGMENTS) {
    const fade = AUDIO_LEVELS.duckFadeFrames;
    const fadeIn = clamp01((frame - (segment.startFrame - fade)) / fade);
    const fadeOut = clamp01(((segment.endFrame + fade) - frame) / fade);
    activity = Math.max(activity, Math.min(fadeIn, fadeOut));
  }
  return activity;
};

export const musicLevelAtFrame = (
  frame: number,
  includeVoice: boolean,
): number => {
  if (!includeVoice) return AUDIO_LEVELS.musicWithoutVoice;
  const duck = 1 - narrationActivityAtFrame(frame) * AUDIO_LEVELS.voiceDuckRatio;
  return AUDIO_LEVELS.musicWithVoice * duck;
};
