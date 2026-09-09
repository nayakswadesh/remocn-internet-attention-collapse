import type {TrendPoint} from '../data/trendSummary';

export interface ChartPoint {
  readonly x: number;
  readonly y: number;
}

export interface PlotBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface AxisTick {
  readonly value: number;
  readonly position: number;
  readonly label: string;
}

export interface LineSegment {
  readonly key: string;
  readonly x1: number;
  readonly x2: number;
  readonly y1: number;
  readonly y2: number;
}

export interface HalfCrossing {
  readonly monthsAfterPeak: number;
  readonly normalizedInterest: number;
  readonly before: TrendPoint;
  readonly after: TrendPoint;
}

export interface TrendGeometry {
  readonly linePath: string;
  readonly areaPath: string;
  readonly peakPoint: ChartPoint | null;
  readonly crossing: HalfCrossing | null;
  readonly crossingPoint: ChartPoint | null;
  readonly baselineY: number;
}

export interface ChartLayout {
  readonly bounds: PlotBounds;
  readonly clipBounds: PlotBounds;
  readonly monthTicks: readonly AxisTick[];
  readonly interestTicks: readonly AxisTick[];
  readonly monthTickLabelY: number;
  readonly interestTickLabelX: number;
  readonly interestTickLabelOffsetY: number;
  readonly thresholdY: number;
  readonly thresholdLabelX: number;
  readonly thresholdLabelY: number;
  readonly xAxisLabelX: number;
  readonly xAxisLabelY: number;
  readonly yAxisLabelX: number;
  readonly yAxisLabelY: number;
  readonly yAxisTransform: string;
}

export interface WeekZoomLayout {
  readonly bounds: PlotBounds;
  readonly ticks: readonly AxisTick[];
  readonly halfY: number;
  readonly peak: ChartPoint;
  readonly intervalX: number;
  readonly intervalWidth: number;
  readonly intervalCenterX: number;
}

export const DEFAULT_CHART_MARGIN: ChartMargin = {
  top: 54,
  right: 34,
  bottom: 116,
  left: 108,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const roundPathValue = (value: number): string => value.toFixed(2);

export const findPeak = (
  points: readonly TrendPoint[],
): {readonly point: TrendPoint; readonly index: number} | null => {
  if (points.length === 0) {
    return null;
  }

  let peakIndex = 0;

  for (let index = 1; index < points.length; index++) {
    const candidate = points[index];
    const currentPeak = points[peakIndex];

    if (
      candidate &&
      currentPeak &&
      candidate.normalizedInterest > currentPeak.normalizedInterest
    ) {
      peakIndex = index;
    }
  }

  const point = points[peakIndex];
  return point ? {point, index: peakIndex} : null;
};

export const normalizePostPeak = (
  points: readonly TrendPoint[],
): readonly TrendPoint[] => {
  const peak = findPeak(points);

  if (!peak || peak.point.normalizedInterest <= 0) {
    return [];
  }

  return points.slice(peak.index).map((point) => ({
    ...point,
    monthsAfterPeak: point.monthsAfterPeak - peak.point.monthsAfterPeak,
    normalizedInterest:
      (point.normalizedInterest / peak.point.normalizedInterest) * 100,
  }));
};

export const mapMonthToX = (
  month: number,
  bounds: PlotBounds,
  maxMonths = 12,
): number => {
  if (maxMonths <= 0) {
    throw new Error('maxMonths must be greater than zero.');
  }

  return bounds.x + (clamp(month, 0, maxMonths) / maxMonths) * bounds.width;
};

export const mapValueToY = (
  value: number,
  bounds: PlotBounds,
  maxValue = 100,
): number => {
  if (maxValue <= 0) {
    throw new Error('maxValue must be greater than zero.');
  }

  return bounds.y + bounds.height - (clamp(value, 0, maxValue) / maxValue) * bounds.height;
};

export const mapWeekToX = (
  week: number,
  bounds: PlotBounds,
  maxWeeks = 4,
): number => {
  if (maxWeeks <= 0) {
    throw new Error('maxWeeks must be greater than zero.');
  }

  return bounds.x + (clamp(week, 0, maxWeeks) / maxWeeks) * bounds.width;
};

export const createPlotBounds = (
  width: number,
  height: number,
  margin: ChartMargin = DEFAULT_CHART_MARGIN,
): PlotBounds => ({
  x: margin.left,
  y: margin.top,
  width: width - margin.left - margin.right,
  height: height - margin.top - margin.bottom,
});

export const createMonthTicks = (
  bounds: PlotBounds,
  maxMonths: number,
  values: readonly number[] = [0, 3, 6, 9, 12],
): readonly AxisTick[] =>
  values
    .filter((month) => month <= maxMonths)
    .map((month) => ({
      value: month,
      position: mapMonthToX(month, bounds, maxMonths),
      label: String(month),
    }));

export const createInterestTicks = (
  bounds: PlotBounds,
  values: readonly number[] = [100, 50, 0],
): readonly AxisTick[] =>
  values.map((interest) => ({
    value: interest,
    position: mapValueToY(interest, bounds),
    label: String(interest),
  }));

export const createGridLines = (
  bounds: PlotBounds,
  columns: number,
  rows: number,
): readonly LineSegment[] => {
  if (columns <= 0 || rows <= 0) {
    throw new Error('Grid rows and columns must be greater than zero.');
  }

  const vertical = Array.from({length: columns + 1}, (_, index) => {
    const x = bounds.x + (bounds.width * index) / columns;
    return {
      key: `vertical-${index}`,
      x1: x,
      x2: x,
      y1: bounds.y,
      y2: bounds.y + bounds.height,
    };
  });
  const horizontal = Array.from({length: rows + 1}, (_, index) => {
    const y = bounds.y + (bounds.height * index) / rows;
    return {
      key: `horizontal-${index}`,
      x1: bounds.x,
      x2: bounds.x + bounds.width,
      y1: y,
      y2: y,
    };
  });

  return [...vertical, ...horizontal];
};

export const createChartLayout = (
  width: number,
  height: number,
  maxMonths = 12,
): ChartLayout => {
  const bounds = createPlotBounds(width, height);
  const thresholdY = mapValueToY(50, bounds);
  const yAxisLabelX = 30;
  const yAxisLabelY = bounds.y + bounds.height / 2;

  return {
    bounds,
    clipBounds: {
      x: bounds.x - 24,
      y: bounds.y - 24,
      width: bounds.width + 48,
      height: bounds.height + 48,
    },
    monthTicks: createMonthTicks(bounds, maxMonths),
    interestTicks: createInterestTicks(bounds),
    monthTickLabelY: bounds.y + bounds.height + 46,
    interestTickLabelX: bounds.x - 24,
    interestTickLabelOffsetY: 8,
    thresholdY,
    thresholdLabelX: bounds.x + bounds.width - 8,
    thresholdLabelY: thresholdY - 16,
    xAxisLabelX: bounds.x + bounds.width / 2,
    xAxisLabelY: height - 24,
    yAxisLabelX,
    yAxisLabelY,
    yAxisTransform: `rotate(-90 ${yAxisLabelX} ${yAxisLabelY})`,
  };
};

export const createWeekZoomLayout = (
  width: number,
  height: number,
  interval: readonly [number, number],
  maxWeeks = 4,
): WeekZoomLayout => {
  const bounds: PlotBounds = {
    x: 96,
    y: 108,
    width: width - 154,
    height: height - 224,
  };
  const intervalStartX = mapWeekToX(interval[0], bounds, maxWeeks);
  const intervalEndX = mapWeekToX(interval[1], bounds, maxWeeks);

  return {
    bounds,
    ticks: [0, 1, 2, 3, 4]
      .filter((week) => week <= maxWeeks)
      .map((week) => ({
        value: week,
        position: mapWeekToX(week, bounds, maxWeeks),
        label: String(week),
      })),
    halfY: mapValueToY(50, bounds),
    peak: {
      x: mapWeekToX(0, bounds, maxWeeks),
      y: mapValueToY(100, bounds),
    },
    intervalX: intervalStartX,
    intervalWidth: intervalEndX - intervalStartX,
    intervalCenterX: (intervalStartX + intervalEndX) / 2,
  };
};

export const toChartPoints = (
  points: readonly TrendPoint[],
  bounds: PlotBounds,
  maxMonths = 12,
): readonly ChartPoint[] =>
  points.map((point) => ({
    x: mapMonthToX(point.monthsAfterPeak, bounds, maxMonths),
    y: mapValueToY(point.normalizedInterest, bounds),
  }));

/** Deterministic Catmull-Rom-to-Bezier spline conversion. */
export const createSpline = (
  points: readonly ChartPoint[],
  tension = 1,
): string => {
  const first = points[0];

  if (!first) {
    return '';
  }

  if (points.length === 1) {
    return `M ${roundPathValue(first.x)} ${roundPathValue(first.y)}`;
  }

  const commands = [`M ${roundPathValue(first.x)} ${roundPathValue(first.y)}`];

  for (let index = 0; index < points.length - 1; index++) {
    const point0 = points[index - 1] ?? points[index];
    const point1 = points[index];
    const point2 = points[index + 1];
    const point3 = points[index + 2] ?? point2;

    if (!point0 || !point1 || !point2 || !point3) {
      continue;
    }

    const control1 = {
      x: point1.x + ((point2.x - point0.x) / 6) * tension,
      y: point1.y + ((point2.y - point0.y) / 6) * tension,
    };
    const control2 = {
      x: point2.x - ((point3.x - point1.x) / 6) * tension,
      y: point2.y - ((point3.y - point1.y) / 6) * tension,
    };

    commands.push(
      `C ${roundPathValue(control1.x)} ${roundPathValue(control1.y)}, ` +
        `${roundPathValue(control2.x)} ${roundPathValue(control2.y)}, ` +
        `${roundPathValue(point2.x)} ${roundPathValue(point2.y)}`,
    );
  }

  return commands.join(' ');
};

export const findHalfCrossing = (
  points: readonly TrendPoint[],
  threshold = 50,
): HalfCrossing | null => {
  const normalized = normalizePostPeak(points);
  const first = normalized[0];

  if (!first) {
    return null;
  }

  if (first.normalizedInterest <= threshold) {
    return {
      monthsAfterPeak: first.monthsAfterPeak,
      normalizedInterest: threshold,
      before: first,
      after: first,
    };
  }

  for (let index = 1; index < normalized.length; index++) {
    const before = normalized[index - 1];
    const after = normalized[index];

    if (
      !before ||
      !after ||
      before.normalizedInterest < threshold ||
      after.normalizedInterest > threshold
    ) {
      continue;
    }

    const interestDelta = before.normalizedInterest - after.normalizedInterest;
    const interpolation =
      interestDelta === 0
        ? 0
        : (before.normalizedInterest - threshold) / interestDelta;

    return {
      monthsAfterPeak:
        before.monthsAfterPeak +
        (after.monthsAfterPeak - before.monthsAfterPeak) * interpolation,
      normalizedInterest: threshold,
      before,
      after,
    };
  }

  return null;
};

export const createAreaPath = (
  points: readonly ChartPoint[],
  baselineY: number,
  tension = 1,
): string => {
  const first = points[0];
  const last = points.at(-1);
  const spline = createSpline(points, tension);

  if (!first || !last || spline.length === 0) {
    return '';
  }

  return `${spline} L ${roundPathValue(last.x)} ${roundPathValue(
    baselineY,
  )} L ${roundPathValue(first.x)} ${roundPathValue(baselineY)} Z`;
};

export const createTrendGeometry = (
  points: readonly TrendPoint[] | undefined,
  bounds: PlotBounds,
  maxMonths = 12,
): TrendGeometry => {
  const baselineY = bounds.y + bounds.height;

  if (!points) {
    return {
      linePath: '',
      areaPath: '',
      peakPoint: null,
      crossing: null,
      crossingPoint: null,
      baselineY,
    };
  }

  const normalized = normalizePostPeak(points);
  const chartPoints = toChartPoints(normalized, bounds, maxMonths);
  const crossing = findHalfCrossing(normalized);
  const crossingPoint = crossing
    ? {
        x: mapMonthToX(crossing.monthsAfterPeak, bounds, maxMonths),
        y: mapValueToY(crossing.normalizedInterest, bounds),
      }
    : null;

  return {
    linePath: createSpline(chartPoints),
    areaPath: createAreaPath(chartPoints, baselineY),
    peakPoint: chartPoints[0] ?? null,
    crossing,
    crossingPoint,
    baselineY,
  };
};
