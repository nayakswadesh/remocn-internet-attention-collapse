import type {AttentionTrend} from '../data/trendSummary';
import {
  createTrendGeometry,
  type PlotBounds,
} from '../lib/chartMath';
import {clamp01} from '../lib/animation';

export interface TrendCurveProps {
  readonly trend: AttentionTrend;
  readonly bounds: PlotBounds;
  readonly active?: boolean;
  readonly maxMonths?: number;
  readonly clipPathId: string;
  readonly progress?: number;
  readonly contextOpacity?: number;
  readonly showArea?: boolean;
  readonly showMarkers?: boolean;
  readonly fadeAfterMonth?: number;
}

const glowFilterId = (idPrefix: string, trendId: string): string =>
  `${idPrefix}-trend-glow-${trendId.replace(/[^a-z0-9-]/gi, '-')}`;

export const TrendCurve = ({
  trend,
  bounds,
  active = false,
  maxMonths = 12,
  clipPathId,
  progress = 1,
  contextOpacity = 0.18,
  showArea = true,
  showMarkers = true,
  fadeAfterMonth,
}: TrendCurveProps) => {
  const geometry = createTrendGeometry(trend.data, bounds, maxMonths);
  const filterId = glowFilterId(clipPathId, trend.id);
  const drawProgress = clamp01(progress);
  const markerOpacity = clamp01((drawProgress - 0.58) / 0.2);
  const opacity = active ? 1 : contextOpacity;
  const fadeOffset = clamp01((fadeAfterMonth ?? maxMonths) / maxMonths);
  const fadedOffset = clamp01(fadeOffset + 0.12);

  if (!trend.data || geometry.linePath.length === 0) {
    return null;
  }

  return (
    <g clipPath={`url(#${clipPathId})`} opacity={opacity}>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id={`${filterId}-area`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={trend.color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={trend.color} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${filterId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={trend.color} stopOpacity={1} />
          <stop offset={`${fadeOffset * 100}%`} stopColor={trend.color} stopOpacity={1} />
          <stop offset={`${fadedOffset * 100}%`} stopColor={trend.color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={trend.color} stopOpacity={0.18} />
        </linearGradient>
      </defs>

      {active && showArea ? (
        <path
          d={geometry.areaPath}
          fill={`url(#${filterId}-area)`}
          opacity={drawProgress}
        />
      ) : null}

      <path
        d={geometry.linePath}
        fill="none"
        stroke={
          active && fadeAfterMonth !== undefined
            ? `url(#${filterId}-line)`
            : trend.color
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 7 : 4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - drawProgress}
        filter={active ? `url(#${filterId})` : undefined}
        vectorEffect="non-scaling-stroke"
      />

      {active && showMarkers && geometry.peakPoint ? (
        <circle
          cx={geometry.peakPoint.x}
          cy={geometry.peakPoint.y}
          r={8}
          fill={trend.color}
          opacity={markerOpacity}
        />
      ) : null}

      {active && showMarkers && geometry.crossingPoint ? (
        <g opacity={markerOpacity}>
          <circle
            cx={geometry.crossingPoint.x}
            cy={geometry.crossingPoint.y}
            r={13}
            fill="#09090b"
            stroke={trend.color}
            strokeWidth={5}
          />
          <line
            x1={geometry.crossingPoint.x}
            x2={geometry.crossingPoint.x}
            y1={geometry.crossingPoint.y}
            y2={geometry.baselineY}
            stroke={trend.color}
            strokeDasharray="7 9"
            strokeOpacity={0.5}
            strokeWidth={2}
          />
        </g>
      ) : null}
    </g>
  );
};
