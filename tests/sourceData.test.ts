import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {trendsWithCurveData} from '../src/data/trendSummary';

interface CsvPoint {
  readonly month: string;
  readonly value: number;
}

const readCsvPoints = (relativePath: string): readonly CsvPoint[] => {
  const text = readFileSync(resolve(process.cwd(), relativePath), 'utf8');
  const lines = text.trim().split(/\r?\n/u).slice(1);

  return lines.map((line) => {
    const match = /^"([^"]+)",(\d+)$/u.exec(line);

    if (!match?.[1] || !match[2]) {
      throw new Error(`Unexpected Google Trends CSV row: ${line}`);
    }

    return {month: match[1].slice(0, 7), value: Number(match[2])};
  });
};

describe('runtime summaries match supplied monthly exports', () => {
  for (const trend of trendsWithCurveData) {
    it(`${trend.name} preserves its peak and following monthly samples`, () => {
      const sourceFile = trend.source.file;

      if (!sourceFile) {
        throw new Error(`${trend.name} is missing its raw source-file reference.`);
      }

      const sourcePoints = readCsvPoints(sourceFile);
      const peakValue = Math.max(...sourcePoints.map((point) => point.value));
      const peakIndex = sourcePoints.findIndex(
        (point) => point.value === peakValue,
      );
      const expected = sourcePoints
        .slice(peakIndex, peakIndex + trend.data.length)
        .map((point, monthsAfterPeak) => ({
          monthsAfterPeak,
          normalizedInterest: point.value,
        }));

      expect(sourcePoints[peakIndex]?.month).toBe(trend.peakMonth);
      expect(trend.data).toEqual(expected);
    });
  }
});

