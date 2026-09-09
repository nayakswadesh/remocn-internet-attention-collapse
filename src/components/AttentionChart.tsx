import type {AttentionTrend} from '../data/trendSummary';
import {createChartLayout} from '../lib/chartMath';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {VIEWER_TERMINOLOGY} from '../lib/terminology';
import {TYPOGRAPHY} from '../lib/typography';
import {Grid} from './Grid';
import {TrendCurve} from './TrendCurve';

export interface AttentionChartProps {
  readonly trends: readonly AttentionTrend[];
  readonly activeTrendId?: string;
  readonly width?: number;
  readonly height?: number;
  readonly maxMonths?: number;
  readonly chartId?: string;
  readonly showFrame?: boolean;
  readonly showTickLabels?: boolean;
  readonly showAxisLabels?: boolean;
  readonly showThreshold?: boolean;
  readonly yAxisLabelPlacement?: 'top' | 'vertical';
  readonly showYAxisLabel?: boolean;
  readonly gridOpacity?: number;
  readonly curveProgress?: Readonly<Record<string, number>>;
  readonly contextOpacity?: number;
  readonly fadeAfterMonths?: Readonly<Record<string, number>>;
}

const orderTrends = (
  trends: readonly AttentionTrend[],
  activeTrendId: string | undefined,
): readonly AttentionTrend[] => [
  ...trends.filter((trend) => trend.id !== activeTrendId),
  ...trends.filter((trend) => trend.id === activeTrendId),
];

export const AttentionChart = ({
  trends,
  activeTrendId,
  width = 950,
  height = 860,
  maxMonths = 12,
  chartId = 'attention-chart',
  showFrame = false,
  showTickLabels = true,
  showAxisLabels = true,
  showThreshold = true,
  yAxisLabelPlacement = 'top',
  showYAxisLabel = true,
  gridOpacity = 0.42,
  curveProgress,
  contextOpacity = 0.18,
  fadeAfterMonths,
}: AttentionChartProps) => {
  const layout = createChartLayout(width, height, maxMonths);
  const {bounds} = layout;
  const orderedTrends = orderTrends(trends, activeTrendId);
  const clipPathId = `${chartId}-plot-clip`;

  return (
    <svg
      aria-label={`${VIEWER_TERMINOLOGY.yAxis} in the months after each trend's peak`}
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      style={{display: 'block', fontFamily: FONT_FAMILY, overflow: 'visible'}}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={layout.clipBounds.x}
            y={layout.clipBounds.y}
            width={layout.clipBounds.width}
            height={layout.clipBounds.height}
          />
        </clipPath>
      </defs>

      {showFrame ? (
        <rect
          x={1}
          y={1}
          width={width - 2}
          height={height - 2}
          rx={28}
          fill="rgba(9, 9, 11, 0.82)"
          stroke="rgba(63, 63, 70, 0.72)"
          strokeWidth={2}
        />
      ) : null}

      <Grid bounds={bounds} columns={12} rows={4} opacity={gridOpacity} />

      {showThreshold ? (
        <>
          <line
            x1={bounds.x}
            x2={bounds.x + bounds.width}
            y1={layout.thresholdY}
            y2={layout.thresholdY}
            stroke={COLORS.threshold}
            strokeDasharray="9 11"
            strokeOpacity={0.44}
            strokeWidth={2}
          />
          <text
            x={layout.thresholdLabelX}
            y={layout.thresholdLabelY}
            fill={COLORS.mutedText}
            fontSize={26}
            fontWeight={650}
            letterSpacing={1.4}
            textAnchor="end"
          >
            50% OF PEAK
          </text>
        </>
      ) : null}

      {orderedTrends.map((trend) => (
        <TrendCurve
          key={trend.id}
          trend={trend}
          bounds={bounds}
          active={trend.id === activeTrendId}
          maxMonths={maxMonths}
          clipPathId={clipPathId}
          progress={curveProgress?.[trend.id] ?? 1}
          contextOpacity={contextOpacity}
          fadeAfterMonth={fadeAfterMonths?.[trend.id]}
        />
      ))}

      {showTickLabels ? (
        <>
          {layout.monthTicks.map((tick) => (
            <text
              key={`month-${tick.value}`}
              x={tick.position}
              y={layout.monthTickLabelY}
              fill={COLORS.mutedText}
              fontSize={TYPOGRAPHY.chartTick.fontSize}
              fontWeight={TYPOGRAPHY.chartTick.fontWeight}
              textAnchor="middle"
            >
              {tick.label}
            </text>
          ))}

          {layout.interestTicks.map((tick) => (
            <text
              key={`interest-${tick.value}`}
              x={layout.interestTickLabelX}
              y={tick.position + layout.interestTickLabelOffsetY}
              fill={COLORS.mutedText}
              fontSize={TYPOGRAPHY.chartTick.fontSize}
              fontWeight={TYPOGRAPHY.chartTick.fontWeight}
              textAnchor="end"
            >
              {tick.label}
            </text>
          ))}
        </>
      ) : null}

      {showAxisLabels ? (
        <>
          <text
            x={layout.xAxisLabelX}
            y={layout.xAxisLabelY}
            fill={COLORS.text}
            fontSize={TYPOGRAPHY.chartAxis.fontSize}
            fontWeight={TYPOGRAPHY.chartAxis.fontWeight}
            letterSpacing={TYPOGRAPHY.chartAxis.letterSpacing}
            textAnchor="middle"
          >
            MONTHS AFTER PEAK
          </text>
          {!showYAxisLabel ? null : yAxisLabelPlacement === 'vertical' ? (
            <text
              x={layout.yAxisLabelX}
              y={layout.yAxisLabelY}
              fill={COLORS.text}
              fontSize={23}
              fontWeight={700}
              letterSpacing={0.5}
              textAnchor="middle"
              transform={layout.yAxisTransform}
            >
              {VIEWER_TERMINOLOGY.yAxis.toUpperCase()}
            </text>
          ) : (
            <text
              x={bounds.x}
              y={34}
              fill={COLORS.mutedText}
              fontSize={24}
              fontWeight={680}
              letterSpacing={1.1}
              textAnchor="start"
            >
              {VIEWER_TERMINOLOGY.yAxis.toUpperCase()}
            </text>
          )}
        </>
      ) : null}
    </svg>
  );
};
