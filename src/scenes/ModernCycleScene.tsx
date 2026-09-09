import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AttentionChart} from '../components/AttentionChart';
import {AttentionCycle} from '../components/AttentionCycle';
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

const GRIMACE = requireMonthlyTrend('grimace-shake');
const SCENE_START = SCENE_TIMING.modernCycle.start;
const localBeat = (globalFrame: number): number => globalFrame - SCENE_START;

const BEATS = {
  transitionCopy: localBeat(BEAT_TIMING.modernCycle.transitionCopy),
  year: localBeat(BEAT_TIMING.modernCycle.year2023),
  subject: localBeat(BEAT_TIMING.modernCycle.grimaceSubject),
  metric: localBeat(BEAT_TIMING.modernCycle.grimaceMetric),
  curve: localBeat(BEAT_TIMING.modernCycle.grimaceCurve),
  trend: localBeat(BEAT_TIMING.modernCycle.trend),
  remix: localBeat(BEAT_TIMING.modernCycle.remix),
  saturate: localBeat(BEAT_TIMING.modernCycle.saturate),
  replace: localBeat(BEAT_TIMING.modernCycle.replace),
  aftermath: localBeat(BEAT_TIMING.modernCycle.aftermath),
  exit: localBeat(BEAT_TIMING.modernCycle.exit),
} as const;

const stageOpacity = (
  frame: number,
  start: number,
  end: number,
  hold = false,
): number => {
  const enter = interpolateClamped(frame, [start, start + 6], [0, 1]);

  if (hold) {
    return enter;
  }

  const exit = interpolateClamped(frame, [end - 6, end], [0, 1]);
  return enter * (1 - exit);
};

const CYCLE_STAGES = [
  {word: 'TREND.', start: BEATS.trend, end: BEATS.remix, color: COLORS.text},
  {word: 'REMIX.', start: BEATS.remix, end: BEATS.saturate, color: COLORS.text},
  {
    word: 'SATURATE.',
    start: BEATS.saturate,
    end: BEATS.replace,
    color: COLORS.text,
  },
  {word: 'REPLACE.', start: BEATS.replace, end: BEATS.exit, color: GRIMACE.color},
] as const;

export const ModernCycleScene = () => {
  const frame = useCurrentFrame();
  const transitionIn = interpolateClamped(frame, [BEATS.transitionCopy, 8], [0, 1]);
  const transitionOut = interpolateClamped(frame, [BEATS.year + 2, BEATS.subject], [0, 1]);
  const yearIn = interpolateClamped(frame, [BEATS.year, BEATS.year + 10], [0, 1]);
  const subjectIn = interpolateClamped(frame, [BEATS.subject, BEATS.subject + 11], [0, 1]);
  const metricIn = interpolateClamped(frame, [BEATS.metric, BEATS.metric + 12], [0, 1]);
  const curve = interpolateClamped(frame, [BEATS.curve, BEATS.trend + 8], [0, 1]);
  const cycleUi = interpolateClamped(frame, [BEATS.trend - 12, BEATS.trend + 10], [0, 1]);
  const cycleProgress = interpolateClamped(
    frame,
    [BEATS.trend, BEATS.remix, BEATS.saturate, BEATS.replace, BEATS.aftermath],
    [0.08, 0.32, 0.67, 0.8, 1],
  );
  const saturateImpact = impactEnvelope(frame, BEATS.saturate, 14);
  const replaceImpact = impactEnvelope(frame, BEATS.replace, 12);
  const sceneExit = interpolateClamped(
    frame,
    [BEATS.exit, SCENE_TIMING.modernCycle.duration],
    [0, 1],
  );
  const headerOpacity = 1 - cycleUi * 0.28;
  const metricOpacity = metricIn * (1 - cycleUi);

  return (
    <FilmBackground accent={GRIMACE.color} gridOpacity={0.16}>
      <AbsoluteFill
        style={{
          opacity: 1 - sceneExit,
          transform: `translateX(${-sceneExit * 120}px)`,
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontSize: 84,
            fontWeight: 860,
            left: 84,
            letterSpacing: -3.4,
            lineHeight: 0.98,
            opacity: transitionIn * (1 - transitionOut),
            position: 'absolute',
            top: 660,
            transform: `translateY(${(1 - transitionIn) * 60 - transitionOut * 54}px)`,
            width: 900,
          }}
        >
          BUT THE CONTENT
          <br />
          <span style={{color: GRIMACE.color}}>CYCLE GOT FASTER.</span>
        </div>

        <div
          style={{
            color: `${GRIMACE.color}2b`,
            fontSize: 260,
            fontWeight: 900,
            left: 72,
            letterSpacing: -15,
            lineHeight: 0.82,
            opacity: yearIn * (1 - subjectIn * 0.88),
            position: 'absolute',
            top: 270,
          }}
        >
          2023
        </div>

        <div
          style={{
            left: 84,
            opacity: headerOpacity,
            position: 'absolute',
            top: 420 - cycleUi * 176,
            width: 912,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.eyebrow,
              color: GRIMACE.color,
              opacity: subjectIn,
              transform: `translateY(${(1 - subjectIn) * 32}px)`,
            }}
          >
            2023 · MODERN CYCLE
          </div>
          <div
            style={{
              ...TYPOGRAPHY.sectionTitle,
              marginTop: 28,
              opacity: subjectIn,
              transform: `translateY(${(1 - subjectIn) * 42}px)`,
            }}
          >
            GRIMACE SHAKE
          </div>
          <div
            style={{
              ...TYPOGRAPHY.metricWide,
              color: GRIMACE.color,
              marginTop: 36,
              opacity: metricOpacity,
              textShadow: '0 0 28px rgba(192,132,252,0.17)',
              transform: `translateY(${(1 - metricIn) * 58}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {GRIMACE.displayWindow}
          </div>
          <div
            style={{
              color: COLORS.mutedText,
              fontSize: 34,
              fontWeight: 600,
              marginTop: 16,
              opacity: metricOpacity,
            }}
          >
            Search Attention Window
          </div>
        </div>

        <div
          style={{
            left: 84,
            opacity: cycleUi,
            position: 'absolute',
            top: 600,
            width: 912,
          }}
        >
          {CYCLE_STAGES.map((stage, index) => {
            const opacity = stageOpacity(
              frame,
              stage.start,
              stage.end,
              index === CYCLE_STAGES.length - 1,
            );

            return (
              <div
                key={stage.word}
                style={{
                  color: stage.color,
                  fontSize: stage.word === 'SATURATE.' ? 90 : 104,
                  fontWeight: 900,
                  left: 0,
                  letterSpacing: -4.8,
                  lineHeight: 0.9,
                  opacity,
                  position: 'absolute',
                  transform: `translateX(${(1 - opacity) * 62}px) scale(${0.94 + opacity * 0.06})`,
                  transformOrigin: 'left center',
                }}
              >
                {stage.word}
              </div>
            );
          })}
        </div>

        <AttentionCycle
          color={GRIMACE.color}
          progress={cycleProgress}
          style={{
            left: 90,
            opacity: cycleUi,
            position: 'absolute',
            top: 715,
            transform: `scale(${1 + saturateImpact * 0.025 - replaceImpact * 0.018})`,
            transformOrigin: 'center center',
          }}
        />

        <div
          style={{
            left: 60,
            opacity: curve * (1 - cycleUi * 0.3),
            position: 'absolute',
            top: 940 + cycleUi * 130,
          }}
        >
          <AttentionChart
            trends={[GRIMACE]}
            activeTrendId={GRIMACE.id}
            width={960}
            height={500}
            chartId="modern-grimace-anchor"
            showTickLabels={false}
            showYAxisLabel={false}
            curveProgress={{[GRIMACE.id]: curve}}
            gridOpacity={0.25}
          />
        </div>
        <SourceCaption
          style={{
            left: 84,
            opacity: curve * (1 - cycleUi * 0.18),
            position: 'absolute',
            top: 1560,
          }}
        />
      </AbsoluteFill>
    </FilmBackground>
  );
};
