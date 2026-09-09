import {describe, expect, it} from 'vitest';
import {
  trendSummary,
  trendsWithCurveData,
} from '../src/data/trendSummary';
import {findHalfCrossing, normalizePostPeak} from '../src/lib/chartMath';
import {VIEWER_TERMINOLOGY} from '../src/lib/terminology';

describe('trend evidence policy', () => {
  it('locks the approved viewer-facing terminology', () => {
    expect(VIEWER_TERMINOLOGY).toEqual({
      metric: 'Search Attention Window',
      yAxis: 'Normalized Google Search Interest',
    });
  });

  it('normalizes every quantitative trend to its own peak', () => {
    for (const trend of trendsWithCurveData) {
      const normalized = normalizePostPeak(trend.data);
      expect(normalized[0]?.monthsAfterPeak).toBe(0);
      expect(normalized[0]?.normalizedInterest).toBe(100);
      expect(findHalfCrossing(normalized)).not.toBeNull();
    }
  });

  it('keeps 6-7 qualitative and free of numeric window data', () => {
    const sixSeven = trendSummary.find((trend) => trend.id === 'six-seven');

    expect(sixSeven?.resolution).toBe('qualitative');
    expect(sixSeven && 'data' in sixSeven).toBe(false);
    expect(sixSeven && 'displayWindow' in sixSeven).toBe(false);
  });

  it('stores Harlem Shake as a supported interval without an invented point', () => {
    const harlem = trendSummary.find((trend) => trend.id === 'harlem-shake');

    expect(harlem?.resolution).toBe('public-week-level');
    expect(harlem?.windowEstimate).toEqual({
      display: '~2–3 WEEKS',
      unit: 'weeks',
      lowerBound: 2,
      upperBound: 3,
    });
    expect(harlem && 'data' in harlem).toBe(false);
  });

  it('does not include excluded phenomena', () => {
    const ids = trendSummary.map((trend) => trend.id);
    expect(ids).not.toContain('ugandan-knuckles');
    expect(ids).not.toContain('bernies-mittens');
    expect(ids).not.toContain('morbin-time');
    expect(ids).not.toContain('very-demure-very-mindful');
  });
});
