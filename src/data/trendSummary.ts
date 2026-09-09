export type EvidenceResolution =
  | 'monthly-google-trends'
  | 'public-week-level'
  | 'qualitative';

export type WindowUnit = 'months' | 'weeks';

export interface TrendPoint {
  /** Canonical chart coordinate. Fractional values are allowed for week evidence. */
  readonly monthsAfterPeak: number;
  /** Interest relative to this trend's own peak, where its peak is 100. */
  readonly normalizedInterest: number;
  readonly approximate?: boolean;
}

export interface AttentionWindowEstimate {
  readonly display: string;
  readonly unit: WindowUnit;
  readonly lowerBound: number;
  readonly upperBound: number;
}

export interface TrendSource {
  readonly label: 'Google Trends' | 'Google search interest';
  readonly file?: string;
  readonly note: string;
}

interface AttentionTrendBase {
  readonly id: string;
  readonly year: number;
  readonly name: string;
  readonly color: string;
  readonly hero: boolean;
  readonly counterExample?: boolean;
  readonly source: TrendSource;
}

export interface MonthlyAttentionTrend extends AttentionTrendBase {
  readonly resolution: 'monthly-google-trends';
  readonly displayWindow: string;
  readonly windowEstimate: AttentionWindowEstimate & {readonly unit: 'months'};
  readonly peakMonth: string;
  readonly data: readonly TrendPoint[];
  readonly qualitativeCycle?: never;
}

export interface WeekLevelAttentionTrend extends AttentionTrendBase {
  readonly resolution: 'public-week-level';
  readonly displayWindow: string;
  readonly windowEstimate: AttentionWindowEstimate & {readonly unit: 'weeks'};
  readonly peakMonth?: never;
  readonly data?: never;
  readonly qualitativeCycle?: never;
}

export interface QualitativeAttentionTrend extends AttentionTrendBase {
  readonly resolution: 'qualitative';
  readonly displayWindow?: never;
  readonly windowEstimate?: never;
  readonly peakMonth?: never;
  readonly data?: never;
  readonly qualitativeCycle: readonly string[];
}

export type QuantitativeAttentionTrend =
  | MonthlyAttentionTrend
  | WeekLevelAttentionTrend;

export type AttentionTrend =
  | QuantitativeAttentionTrend
  | QualitativeAttentionTrend;

const monthlySeries = (values: readonly number[]): readonly TrendPoint[] =>
  values.map((normalizedInterest, monthsAfterPeak) => ({
    monthsAfterPeak,
    normalizedInterest,
  }));

export const trendSummary: readonly AttentionTrend[] = [
  {
    id: 'nyan-cat',
    year: 2011,
    name: 'Nyan Cat',
    displayWindow: '~9 MONTHS',
    windowEstimate: {
      display: '~9 MONTHS',
      unit: 'months',
      lowerBound: 8,
      upperBound: 9,
    },
    resolution: 'monthly-google-trends',
    color: '#22d3ee',
    hero: true,
    peakMonth: '2011-06',
    data: monthlySeries([100, 97, 73, 69, 78, 84, 74, 58, 52, 48, 43, 42, 41]),
    source: {
      label: 'Google Trends',
      file: 'datasets/Nyan Cat.csv',
      note: 'Monthly series; first below-half sample is March 2012.',
    },
  },
  {
    id: 'gangnam-style',
    year: 2012,
    name: 'Gangnam Style',
    displayWindow: '~4 MONTHS',
    windowEstimate: {
      display: '~4 MONTHS',
      unit: 'months',
      lowerBound: 3,
      upperBound: 4,
    },
    resolution: 'monthly-google-trends',
    color: '#f472b6',
    hero: true,
    peakMonth: '2012-10',
    data: monthlySeries([100, 87, 90, 57, 43, 32, 24, 17, 14, 12, 10, 7, 7]),
    source: {
      label: 'Google Trends',
      file: 'datasets/Gangnam Style.csv',
      note: 'Monthly series; first below-half sample is February 2013.',
    },
  },
  {
    id: 'harlem-shake',
    year: 2013,
    name: 'Harlem Shake',
    displayWindow: '~2–3 WEEKS',
    windowEstimate: {
      display: '~2–3 WEEKS',
      unit: 'weeks',
      lowerBound: 2,
      upperBound: 3,
    },
    resolution: 'public-week-level',
    color: '#fb7185',
    hero: true,
    source: {
      label: 'Google search interest',
      note:
        'Public contemporary evidence reported interest roughly 50% below a mid-February peak by March 4, 2013. Only the supported 2–3 week interval is stored; no exact crossing point is synthesized.',
    },
  },
  {
    id: 'ice-bucket-challenge',
    year: 2014,
    name: 'Ice Bucket Challenge',
    displayWindow: '<1 MONTH',
    windowEstimate: {
      display: '<1 MONTH',
      unit: 'months',
      lowerBound: 0,
      upperBound: 1,
    },
    resolution: 'monthly-google-trends',
    color: '#60a5fa',
    hero: false,
    peakMonth: '2014-08',
    data: monthlySeries([100, 14, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]),
    source: {
      label: 'Google Trends',
      file: 'datasets/ALS Ice Bucket.csv',
      note: 'Monthly series; the next monthly sample is already below half.',
    },
  },
  {
    id: 'mannequin-challenge',
    year: 2016,
    name: 'Mannequin Challenge',
    displayWindow: '~1–2 MONTHS',
    windowEstimate: {
      display: '~1–2 MONTHS',
      unit: 'months',
      lowerBound: 1,
      upperBound: 2,
    },
    resolution: 'monthly-google-trends',
    color: '#a78bfa',
    hero: true,
    peakMonth: '2016-11',
    data: monthlySeries([100, 89, 30, 14, 9, 6, 4, 3, 2, 2, 2, 2, 2]),
    source: {
      label: 'Google Trends',
      file: 'datasets/Mannequin Challenge.csv',
      note: 'Monthly series; first below-half sample is January 2017.',
    },
  },
  {
    id: 'coffin-dance',
    year: 2020,
    name: 'Coffin Dance',
    displayWindow: '~4 MONTHS',
    windowEstimate: {
      display: '~4 MONTHS',
      unit: 'months',
      lowerBound: 3,
      upperBound: 4,
    },
    resolution: 'monthly-google-trends',
    color: '#34d399',
    hero: false,
    counterExample: true,
    peakMonth: '2020-06',
    data: monthlySeries([100, 92, 69, 53, 46, 40, 33, 31, 27, 24, 22, 24, 23]),
    source: {
      label: 'Google Trends',
      file: 'datasets/Coffin Dance.csv',
      note: 'Monthly series; first below-half sample is October 2020.',
    },
  },
  {
    id: 'grimace-shake',
    year: 2023,
    name: 'Grimace Shake',
    displayWindow: '~1–2 MONTHS',
    windowEstimate: {
      display: '~1–2 MONTHS',
      unit: 'months',
      lowerBound: 1,
      upperBound: 2,
    },
    resolution: 'monthly-google-trends',
    color: '#c084fc',
    hero: true,
    peakMonth: '2023-07',
    data: monthlySeries([100, 58, 27, 17, 9, 7, 7, 7, 7, 9, 19, 33, 16]),
    source: {
      label: 'Google Trends',
      file: 'datasets/Grimace Shake.csv',
      note: 'Monthly series; first below-half sample is September 2023.',
    },
  },
  {
    id: 'six-seven',
    year: 2025,
    name: '6-7',
    resolution: 'qualitative',
    color: '#f4f4f5',
    hero: false,
    source: {
      label: 'Google Trends',
      file: 'datasets/6-7.csv',
      note:
        'Ambiguous search term and monthly resolution; intentionally carries no numeric attention-window claim.',
    },
    qualitativeCycle: ['VIRAL', 'EVERYWHERE', 'OVERUSED', 'NEXT.'],
  },
] as const;

export const quantitativeTrends = trendSummary.filter(
  (trend): trend is QuantitativeAttentionTrend =>
    trend.resolution !== 'qualitative',
);

export const trendsWithCurveData = trendSummary.filter(
  (trend): trend is MonthlyAttentionTrend =>
    trend.resolution === 'monthly-google-trends',
);

export const getTrendById = (id: string): AttentionTrend | undefined =>
  trendSummary.find((trend) => trend.id === id);

export const SOURCE_CAPTION =
  'Source: Google Trends • normalized search interest';
