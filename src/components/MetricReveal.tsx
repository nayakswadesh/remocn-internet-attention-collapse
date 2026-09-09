import type {CSSProperties} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING_PRESETS} from '../lib/animation';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {VIEWER_TERMINOLOGY} from '../lib/terminology';
import {MOTION_TIMING} from '../lib/timing';

export interface MetricRevealProps {
  readonly value: string;
  readonly label?: string;
  readonly startFrame?: number;
  readonly color?: string;
  readonly style?: CSSProperties;
}

/** Generic metric primitive. Specific statistics and scene timing arrive later. */
export const MetricReveal = ({
  value,
  label = VIEWER_TERMINOLOGY.metric,
  startFrame = 0,
  color = COLORS.text,
  style,
}: MetricRevealProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.impact,
    durationInFrames: MOTION_TIMING.metricReveal,
  });

  return (
    <div
      style={{
        color,
        fontFamily: FONT_FAMILY,
        opacity: progress,
        transform: `scale(${0.88 + progress * 0.12})`,
        transformOrigin: 'center',
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{fontSize: 164, fontWeight: 850, letterSpacing: -7}}>{value}</div>
      <div
        style={{
          color: COLORS.mutedText,
          fontSize: 38,
          fontWeight: 600,
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};
