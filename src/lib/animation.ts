import {interpolate, type SpringConfig} from 'remotion';
import {MOTION_TIMING} from './timing';

export const CLAMP = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const clamp01 = (value: number): number =>
  Math.min(1, Math.max(0, value));

export const SPRING_PRESETS = {
  restrained: {
    damping: 18,
    mass: 0.75,
    overshootClamping: false,
    stiffness: 190,
  },
  impact: {
    damping: 15,
    mass: 0.6,
    overshootClamping: false,
    stiffness: 260,
  },
} as const satisfies Record<string, SpringConfig>;

export const interpolateClamped = (
  value: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
): number =>
  interpolate(value, [...inputRange], [...outputRange], {
    ...CLAMP,
  });

/**
 * A short deterministic envelope for future impact effects. The caller supplies
 * a frame from useCurrentFrame(); no wall-clock or random state is involved.
 */
export const impactEnvelope = (
  frame: number,
  startFrame: number,
  durationInFrames: number = MOTION_TIMING.impactEnvelope,
): number => {
  const localFrame = frame - startFrame;
  const riseEnd = Math.max(1, durationInFrames * 0.18);

  if (localFrame < 0 || localFrame > durationInFrames) {
    return 0;
  }

  return interpolateClamped(
    localFrame,
    [0, riseEnd, durationInFrames],
    [0, 1, 0],
  );
};

const IMPACT_SHAKE_PATTERN = [0, -1, 0.82, -0.58, 0.34, -0.16, 0.06, 0] as const;

/** A short, repeatable impact displacement. Supply the current Remotion frame. */
export const impactShake = (
  frame: number,
  startFrame: number,
  amplitude = 4,
): number => {
  const localFrame = Math.floor(frame - startFrame);

  if (localFrame < 0 || localFrame >= IMPACT_SHAKE_PATTERN.length) {
    return 0;
  }

  return (IMPACT_SHAKE_PATTERN[localFrame] ?? 0) * amplitude;
};
