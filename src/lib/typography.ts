import type {CSSProperties} from 'react';

export type TypographyToken = Pick<
  CSSProperties,
  'fontSize' | 'fontWeight' | 'letterSpacing' | 'lineHeight'
>;

export const TYPOGRAPHY = {
  eyebrow: {
    fontSize: 28,
    fontWeight: 760,
    letterSpacing: 4.6,
    lineHeight: 1,
  },
  hook: {
    fontSize: 128,
    fontWeight: 860,
    letterSpacing: -5.5,
    lineHeight: 0.88,
  },
  hookMiddle: {
    fontSize: 92,
    fontWeight: 820,
    letterSpacing: -4.2,
    lineHeight: 0.92,
  },
  hookDominant: {
    fontSize: 202,
    fontWeight: 900,
    letterSpacing: -10,
    lineHeight: 0.82,
  },
  sectionTitle: {
    fontSize: 72,
    fontWeight: 830,
    letterSpacing: -3.4,
    lineHeight: 0.96,
  },
  subject: {
    fontSize: 58,
    fontWeight: 810,
    letterSpacing: -2,
    lineHeight: 1,
  },
  metric: {
    fontSize: 168,
    fontWeight: 880,
    letterSpacing: -8,
    lineHeight: 0.9,
  },
  metricCompact: {
    fontSize: 142,
    fontWeight: 880,
    letterSpacing: -7,
    lineHeight: 0.9,
  },
  metricWide: {
    fontSize: 132,
    fontWeight: 880,
    letterSpacing: -6.5,
    lineHeight: 0.9,
  },
  secondary: {
    fontSize: 42,
    fontWeight: 620,
    letterSpacing: -0.7,
    lineHeight: 1.2,
  },
  body: {
    fontSize: 32,
    fontWeight: 540,
    letterSpacing: -0.2,
    lineHeight: 1.3,
  },
  chartAxis: {
    fontSize: 30,
    fontWeight: 720,
    letterSpacing: 0.5,
    lineHeight: 1,
  },
  chartTick: {
    fontSize: 26,
    fontWeight: 620,
    letterSpacing: 0,
    lineHeight: 1,
  },
  source: {
    fontSize: 24,
    fontWeight: 560,
    letterSpacing: 0.1,
    lineHeight: 1.2,
  },
  payoff: {
    fontSize: 82,
    fontWeight: 830,
    letterSpacing: -3.8,
    lineHeight: 0.96,
  },
  payoffDominant: {
    fontSize: 202,
    fontWeight: 900,
    letterSpacing: -9,
    lineHeight: 0.86,
  },
} as const satisfies Record<string, TypographyToken>;
