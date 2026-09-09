import type {CSSProperties} from 'react';
import {clamp01} from '../lib/animation';
import {createWeekZoomLayout} from '../lib/chartMath';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {TYPOGRAPHY} from '../lib/typography';
import {Grid} from './Grid';

export interface WeekZoomInsetProps {
  readonly interval?: readonly [number, number];
  readonly width?: number;
  readonly height?: number;
  readonly color?: string;
  readonly progress?: number;
  readonly style?: CSSProperties;
}

/**
 * Week-scale evidence view for Harlem Shake. It deliberately renders the
 * supported crossing interval as a band and never synthesizes a precise point.
 */
export const WeekZoomInset = ({
  interval = [2, 3],
  width = 920,
  height = 620,
  color = '#fb7185',
  progress = 1,
  style,
}: WeekZoomInsetProps) => {
  const layout = createWeekZoomLayout(width, height, interval);
  const reveal = clamp01(progress);
  const intervalReveal = clamp01((reveal - 0.28) / 0.42);
  const bracketY = layout.halfY;

  return (
    <svg
      aria-label="Harlem Shake week-level view showing a supported half-interest interval between weeks two and three"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      style={{display: 'block', fontFamily: FONT_FAMILY, ...style}}
    >
      <defs>
        <linearGradient id="week-range-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.04} />
          <stop offset="50%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
        <filter id="week-range-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={`M 22 76 V 22 H 76 M ${width - 76} 22 H ${width - 22} V 76 M 22 ${height - 76} V ${height - 22} H 76 M ${width - 76} ${height - 22} H ${width - 22} V ${height - 76}`}
        fill="none"
        stroke={color}
        strokeOpacity={0.48}
        strokeWidth={3}
      />

      <text
        x={44}
        y={62}
        fill={COLORS.mutedText}
        fontSize={TYPOGRAPHY.eyebrow.fontSize}
        fontWeight={TYPOGRAPHY.eyebrow.fontWeight}
        letterSpacing={3.3}
      >
        FIRST MONTH · MAGNIFIED
      </text>

      <Grid bounds={layout.bounds} columns={4} rows={4} opacity={0.42} />

      <rect
        x={layout.intervalX}
        y={layout.bounds.y}
        width={layout.intervalWidth * intervalReveal}
        height={layout.bounds.height}
        fill="url(#week-range-fill)"
      />
      <line
        x1={layout.intervalX}
        x2={layout.intervalX}
        y1={layout.bounds.y}
        y2={layout.bounds.y + layout.bounds.height}
        stroke={color}
        strokeOpacity={0.72 * intervalReveal}
        strokeWidth={3}
      />
      <line
        x1={layout.intervalX + layout.intervalWidth * intervalReveal}
        x2={layout.intervalX + layout.intervalWidth * intervalReveal}
        y1={layout.bounds.y}
        y2={layout.bounds.y + layout.bounds.height}
        stroke={color}
        strokeOpacity={0.72 * intervalReveal}
        strokeWidth={3}
      />

      <line
        x1={layout.bounds.x}
        x2={layout.bounds.x + layout.bounds.width}
        y1={layout.halfY}
        y2={layout.halfY}
        stroke={COLORS.threshold}
        strokeDasharray="9 12"
        strokeOpacity={0.56}
        strokeWidth={2}
      />
      <text
        x={layout.bounds.x - 22}
        y={layout.halfY + 8}
        fill={COLORS.mutedText}
        fontSize={TYPOGRAPHY.chartTick.fontSize}
        fontWeight={TYPOGRAPHY.chartTick.fontWeight}
        textAnchor="end"
      >
        50
      </text>

      <circle
        cx={layout.peak.x}
        cy={layout.peak.y}
        r={10}
        fill={color}
        filter="url(#week-range-glow)"
        opacity={reveal}
      />
      <text
        x={layout.peak.x}
        y={layout.peak.y - 24}
        fill={color}
        fontSize={22}
        fontWeight={760}
        letterSpacing={1.6}
        textAnchor="middle"
        opacity={reveal}
      >
        PEAK
      </text>

      <g opacity={intervalReveal}>
        <line
          x1={layout.intervalX}
          x2={layout.intervalX + layout.intervalWidth}
          y1={bracketY}
          y2={bracketY}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          filter="url(#week-range-glow)"
        />
        <circle cx={layout.intervalX} cy={bracketY} r={8} fill={color} />
        <circle
          cx={layout.intervalX + layout.intervalWidth}
          cy={bracketY}
          r={8}
          fill={color}
        />
        <text
          x={layout.intervalCenterX}
          y={bracketY - 30}
          fill={COLORS.text}
          fontSize={25}
          fontWeight={760}
          letterSpacing={0.8}
          textAnchor="middle"
        >
          SUPPORTED RANGE
        </text>
      </g>

      {layout.ticks.map((tick) => (
        <text
          key={tick.value}
          x={tick.position}
          y={layout.bounds.y + layout.bounds.height + 42}
          fill={
            tick.value >= interval[0] && tick.value <= interval[1]
              ? color
              : COLORS.mutedText
          }
          fontSize={TYPOGRAPHY.chartTick.fontSize}
          fontWeight={tick.value >= interval[0] && tick.value <= interval[1] ? 780 : 620}
          textAnchor="middle"
        >
          {tick.label}
        </text>
      ))}
      <text
        x={layout.bounds.x + layout.bounds.width / 2}
        y={height - 38}
        fill={COLORS.text}
        fontSize={TYPOGRAPHY.chartAxis.fontSize}
        fontWeight={TYPOGRAPHY.chartAxis.fontWeight}
        letterSpacing={TYPOGRAPHY.chartAxis.letterSpacing}
        textAnchor="middle"
      >
        WEEKS AFTER PEAK
      </text>
    </svg>
  );
};

