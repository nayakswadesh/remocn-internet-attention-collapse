import {describe, expect, it} from 'vitest';
import type {TrendPoint} from '../src/data/trendSummary';
import {
  createAreaPath,
  createChartLayout,
  createGridLines,
  createSpline,
  createWeekZoomLayout,
  findHalfCrossing,
  findPeak,
  mapMonthToX,
  mapValueToY,
  normalizePostPeak,
  type PlotBounds,
} from '../src/lib/chartMath';

const bounds: PlotBounds = {x: 100, y: 40, width: 600, height: 400};

describe('chartMath', () => {
  it('finds the peak and normalizes only the post-peak samples', () => {
    const points: readonly TrendPoint[] = [
      {monthsAfterPeak: -1, normalizedInterest: 20},
      {monthsAfterPeak: 0, normalizedInterest: 80},
      {monthsAfterPeak: 1, normalizedInterest: 40},
    ];

    expect(findPeak(points)).toEqual({point: points[1], index: 1});
    expect(normalizePostPeak(points)).toEqual([
      {monthsAfterPeak: 0, normalizedInterest: 100},
      {monthsAfterPeak: 1, normalizedInterest: 50},
    ]);
  });

  it('interpolates the first post-peak 50% crossing', () => {
    const points: readonly TrendPoint[] = [
      {monthsAfterPeak: 0, normalizedInterest: 100},
      {monthsAfterPeak: 1, normalizedInterest: 75},
      {monthsAfterPeak: 2, normalizedInterest: 25},
      {monthsAfterPeak: 3, normalizedInterest: 60},
    ];

    expect(findHalfCrossing(points)?.monthsAfterPeak).toBeCloseTo(1.5);
  });

  it('maps the declared 0–12 month and 0–100 interest domains', () => {
    expect(mapMonthToX(0, bounds)).toBe(100);
    expect(mapMonthToX(12, bounds)).toBe(700);
    expect(mapValueToY(100, bounds)).toBe(40);
    expect(mapValueToY(0, bounds)).toBe(440);
  });

  it('creates deterministic line and closed-area SVG paths', () => {
    const points = [
      {x: 0, y: 0},
      {x: 10, y: 5},
      {x: 20, y: 10},
    ] as const;

    const spline = createSpline(points);
    expect(spline).toBe(createSpline(points));
    expect(spline).not.toContain('NaN');
    expect(createAreaPath(points, 20)).toMatch(/^M .* Z$/);
  });

  it('computes reusable chart layout and grid geometry outside React', () => {
    const layout = createChartLayout(950, 860);
    const lines = createGridLines(layout.bounds, 12, 4);

    expect(layout.bounds).toEqual({x: 108, y: 54, width: 808, height: 690});
    expect(layout.monthTicks.map((tick) => tick.label)).toEqual([
      '0',
      '3',
      '6',
      '9',
      '12',
    ]);
    expect(lines).toHaveLength(18);
  });

  it('represents the Harlem week evidence as an interval', () => {
    const layout = createWeekZoomLayout(920, 620, [2, 3]);

    expect(layout.intervalWidth).toBeGreaterThan(0);
    expect(layout.intervalCenterX).toBeGreaterThan(layout.intervalX);
    expect(layout.ticks.map((tick) => tick.label)).toEqual(['0', '1', '2', '3', '4']);
  });
});
