import type {CSSProperties, ReactNode} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, SPRING_PRESETS} from '../lib/animation';
import {FONT_FAMILY} from '../lib/theme';
import {MOTION_TIMING} from '../lib/timing';

export interface KineticTextProps {
  readonly children: ReactNode;
  readonly startFrame?: number;
  readonly style?: CSSProperties;
}

/** Foundational text entrance primitive; scene copy is intentionally deferred. */
export const KineticText = ({
  children,
  startFrame = 0,
  style,
}: KineticTextProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.restrained,
    durationInFrames: MOTION_TIMING.kineticTextEntrance,
  });
  const translateY = interpolate(progress, [0, 1], [42, 0], CLAMP);

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        opacity: progress,
        transform: `translateY(${translateY}px) scale(${0.96 + progress * 0.04})`,
        transformOrigin: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
