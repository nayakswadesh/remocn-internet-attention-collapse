import type {CSSProperties} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AttentionChart} from '../components/AttentionChart';
import {SourceCaption} from '../components/SourceCaption';
import {
  getTrendById,
  type MonthlyAttentionTrend,
} from '../data/trendSummary';
import {impactEnvelope, interpolateClamped} from '../lib/animation';
import {COLORS} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground} from '../visuals/HeroStates';

const requireMonthlyTrend = (id: string): MonthlyAttentionTrend => {
  const trend = getTrendById(id);

  if (!trend || trend.resolution !== 'monthly-google-trends') {
    throw new Error(`Missing monthly trend: ${id}`);
  }

  return trend;
};

const ICE_BUCKET = requireMonthlyTrend('ice-bucket-challenge');
const MANNEQUIN = requireMonthlyTrend('mannequin-challenge');
const COFFIN = requireMonthlyTrend('coffin-dance');
const SCENE_START = SCENE_TIMING.exceptions.start;
const localBeat = (globalFrame: number): number => globalFrame - SCENE_START;

const BEATS = {
  iceYear: localBeat(BEAT_TIMING.exceptions.iceYear),
  iceSubject: localBeat(BEAT_TIMING.exceptions.iceSubject),
  iceCurve: localBeat(BEAT_TIMING.exceptions.iceCurve),
  iceMetric: localBeat(BEAT_TIMING.exceptions.iceMetric),
  mannequinYear: localBeat(BEAT_TIMING.exceptions.mannequinYear),
  mannequinSubject: localBeat(BEAT_TIMING.exceptions.mannequinSubject),
  mannequinCurve: localBeat(BEAT_TIMING.exceptions.mannequinCurve),
  mannequinMetric: localBeat(BEAT_TIMING.exceptions.mannequinMetric),
  coffinYear: localBeat(BEAT_TIMING.exceptions.coffinYear),
  coffinSubject: localBeat(BEAT_TIMING.exceptions.coffinSubject),
  coffinCurve: localBeat(BEAT_TIMING.exceptions.coffinCurve),
  coffinKeepsGoing: localBeat(BEAT_TIMING.exceptions.coffinKeepsGoing),
  wait: localBeat(BEAT_TIMING.exceptions.counterexampleReveal),
  coffinMetric: localBeat(BEAT_TIMING.exceptions.coffinMetric),
  counterStatement: localBeat(BEAT_TIMING.exceptions.counterStatement),
  exit: localBeat(BEAT_TIMING.exceptions.exit),
} as const;

const enterStyle = (
  progress: number,
  distance = 54,
  scaleFrom = 0.96,
): CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px) scale(${scaleFrom + progress * (1 - scaleFrom)})`,
});

interface TrendBeatProps {
  readonly frame: number;
  readonly start: number;
  readonly end: number;
  readonly subjectOffset: number;
  readonly curveOffset: number;
  readonly metricOffset: number;
  readonly curveDuration: number;
  readonly trend: MonthlyAttentionTrend;
  readonly context?: readonly MonthlyAttentionTrend[];
  readonly chartId: string;
  readonly dimHeader?: number;
}

const TrendBeat = ({
  frame,
  start,
  end,
  subjectOffset,
  curveOffset,
  metricOffset,
  curveDuration,
  trend,
  context = [],
  chartId,
  dimHeader = 0,
}: TrendBeatProps) => {
  const local = frame - start;
  const enter = interpolateClamped(frame, [start, start + 7], [0, 1]);
  const exit = interpolateClamped(frame, [end - 10, end], [0, 1]);
  const opacity = enter * (1 - exit);
  const year = interpolateClamped(local, [0, 10], [0, 1]);
  const subject = interpolateClamped(local, [subjectOffset, subjectOffset + 10], [0, 1]);
  const metric = interpolateClamped(local, [metricOffset, metricOffset + 11], [0, 1]);
  const curve = interpolateClamped(local, [curveOffset, curveOffset + curveDuration], [0, 1]);
  const headerOpacity = 1 - dimHeader * 0.72;
  const trends = [...context, trend];
  const curveProgress = Object.fromEntries([
    ...context.map((item) => [item.id, 1] as const),
    [trend.id, curve] as const,
  ]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${-exit * 88}px)`,
      }}
    >
      <div
        style={{
          color: `${trend.color}2e`,
          fontSize: 260,
          fontWeight: 900,
          left: 74,
          letterSpacing: -15,
          lineHeight: 0.82,
          opacity: year * (1 - subject * 0.52),
          position: 'absolute',
          top: 270,
        }}
      >
        {trend.year}
      </div>

      <div
        style={{
          left: 84,
          opacity: headerOpacity,
          position: 'absolute',
          top: 540,
          width: 912,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.eyebrow,
            ...enterStyle(subject, 36),
            color: trend.color,
          }}
        >
          {trend.year} · SEARCH ATTENTION
        </div>
        <div
          style={{
            ...TYPOGRAPHY.sectionTitle,
            ...enterStyle(subject, 48),
            fontSize: trend.id === 'ice-bucket-challenge' ? 64 : 70,
            marginTop: 28,
            whiteSpace: 'nowrap',
          }}
        >
          {trend.name.toUpperCase()}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.metricCompact,
            ...enterStyle(metric, 64, 0.91),
            color: trend.color,
            marginTop: 34,
            textShadow: `0 0 28px ${trend.color}24`,
            whiteSpace: 'nowrap',
          }}
        >
          {trend.displayWindow}
        </div>
        <div
          style={{
            color: COLORS.mutedText,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: -0.4,
            marginTop: 16,
            opacity: metric,
          }}
        >
          Search Attention Window
        </div>
      </div>

      <div
        style={{
          left: 60,
          opacity: curve,
          position: 'absolute',
          top: 980,
        }}
      >
        <AttentionChart
          trends={trends}
          activeTrendId={trend.id}
          width={960}
          height={500}
          chartId={chartId}
          showTickLabels={false}
          showYAxisLabel={false}
          curveProgress={curveProgress}
          contextOpacity={0.14}
          gridOpacity={0.28}
        />
      </div>
      <SourceCaption
        style={{left: 84, opacity: curve, position: 'absolute', top: 1515}}
      />
    </AbsoluteFill>
  );
};

export const ExceptionsScene = () => {
  const frame = useCurrentFrame();
  const sceneAccent =
    frame < BEATS.mannequinYear
      ? ICE_BUCKET.color
      : frame < BEATS.coffinYear
        ? MANNEQUIN.color
        : COFFIN.color;
  const waitIn = interpolateClamped(frame, [BEATS.wait, BEATS.wait + 6], [0, 1]);
  const waitOut = interpolateClamped(
    frame,
    [BEATS.coffinMetric + 2, BEATS.coffinMetric + 12],
    [0, 1],
  );
  const wait = waitIn * (1 - waitOut);
  const stillGoing =
    interpolateClamped(
      frame,
      [BEATS.coffinKeepsGoing, BEATS.coffinKeepsGoing + 8],
      [0, 1],
    ) *
    (1 - interpolateClamped(frame, [BEATS.wait - 5, BEATS.wait + 2], [0, 1]));
  const counter = interpolateClamped(
    frame,
    [BEATS.counterStatement, BEATS.counterStatement + 9],
    [0, 1],
  );
  const counterBackdrop = interpolateClamped(
    frame,
    [BEATS.counterStatement - 5, BEATS.counterStatement + 1],
    [0, 1],
  );
  const sceneExit = interpolateClamped(
    frame,
    [BEATS.exit, SCENE_TIMING.exceptions.duration],
    [0, 1],
  );
  const waitImpact = impactEnvelope(frame, BEATS.wait, 12);

  return (
    <FilmBackground accent={sceneAccent} gridOpacity={0.15}>
      <AbsoluteFill style={{opacity: 1 - sceneExit}}>
        <TrendBeat
          frame={frame}
          start={BEATS.iceYear}
          end={BEATS.mannequinYear + 4}
          subjectOffset={BEATS.iceSubject - BEATS.iceYear}
          curveOffset={BEATS.iceCurve - BEATS.iceYear}
          metricOffset={BEATS.iceMetric - BEATS.iceYear}
          curveDuration={28}
          trend={ICE_BUCKET}
          chartId="exceptions-ice-bucket"
        />
        <TrendBeat
          frame={frame}
          start={BEATS.mannequinYear}
          end={BEATS.coffinYear + 5}
          subjectOffset={BEATS.mannequinSubject - BEATS.mannequinYear}
          curveOffset={BEATS.mannequinCurve - BEATS.mannequinYear}
          metricOffset={BEATS.mannequinMetric - BEATS.mannequinYear}
          curveDuration={30}
          trend={MANNEQUIN}
          context={[ICE_BUCKET]}
          chartId="exceptions-mannequin"
        />
        <TrendBeat
          frame={frame}
          start={BEATS.coffinYear}
          end={SCENE_TIMING.exceptions.duration}
          subjectOffset={BEATS.coffinSubject - BEATS.coffinYear}
          curveOffset={BEATS.coffinCurve - BEATS.coffinYear}
          metricOffset={BEATS.coffinMetric - BEATS.coffinYear}
          curveDuration={66}
          trend={COFFIN}
          context={[ICE_BUCKET, MANNEQUIN]}
          chartId="exceptions-coffin-dance"
          dimHeader={wait}
        />

        <div
          style={{
            color: COFFIN.color,
            fontSize: 30,
            fontWeight: 780,
            letterSpacing: 2.2,
            opacity: stillGoing,
            position: 'absolute',
            right: 84,
            top: 920,
            transform: `translateX(${(1 - stillGoing) * 54}px)`,
          }}
        >
          ...STILL GOING
        </div>

        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.94) 27%, rgba(9,9,11,0.94) 53%, transparent 68%)',
            opacity: wait,
          }}
        />
        <div
          style={{
            color: COLORS.text,
            fontSize: 184,
            fontWeight: 900,
            left: 80,
            letterSpacing: -8,
            opacity: wait,
            position: 'absolute',
            top: 560,
            transform: `scale(${0.92 + wait * 0.08 + waitImpact * 0.025})`,
            transformOrigin: 'left center',
          }}
        >
          WAIT<span style={{color: COFFIN.color}}>.</span>
        </div>

        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 62%, rgba(9,9,11,0.98) 66%, #09090b 70%)',
            opacity: counterBackdrop,
          }}
        />
        <div
          style={{
            color: COLORS.text,
            fontSize: 59,
            fontWeight: 850,
            left: 84,
            letterSpacing: -2.2,
            lineHeight: 1.02,
            opacity: counter,
            position: 'absolute',
            top: 1390,
            transform: `translateY(${(1 - counter) * 42}px)`,
          }}
        >
          SOME MEMES
          <br />
          <span style={{color: COFFIN.color}}>STILL LINGERED.</span>
        </div>
      </AbsoluteFill>
    </FilmBackground>
  );
};
