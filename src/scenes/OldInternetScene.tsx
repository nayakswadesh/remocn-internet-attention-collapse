import type {CSSProperties} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AttentionChart} from '../components/AttentionChart';
import {SourceCaption} from '../components/SourceCaption';
import {getTrendById, type AttentionTrend} from '../data/trendSummary';
import {clamp01, interpolateClamped} from '../lib/animation';
import {COLORS} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground, OldInternetState} from '../visuals/HeroStates';

const requireTrend = (id: string): AttentionTrend => {
  const trend = getTrendById(id);
  if (!trend) {
    throw new Error(`Missing trend: ${id}`);
  }
  return trend;
};

const NYAN = requireTrend('nyan-cat');
const SCENE_START = SCENE_TIMING.oldInternet.start;
const localBeat = (globalFrame: number): number => globalFrame - SCENE_START;

const OLD_BEATS = {
  year2011: localBeat(BEAT_TIMING.oldInternet.year2011),
  nyanReveal: localBeat(BEAT_TIMING.oldInternet.nyanReveal),
  nyanMetric: localBeat(BEAT_TIMING.oldInternet.nyanMetric),
  nyanChart: localBeat(BEAT_TIMING.oldInternet.nyanChart),
  year2012: localBeat(BEAT_TIMING.oldInternet.year2012),
  gangnamReveal: localBeat(BEAT_TIMING.oldInternet.gangnamReveal),
  lingerStatement: localBeat(BEAT_TIMING.oldInternet.lingerStatement),
  exit: localBeat(BEAT_TIMING.oldInternet.exit),
} as const;

const enterStyle = (
  progress: number,
  distance = 52,
  scaleFrom = 0.96,
): CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px) scale(${scaleFrom + progress * (1 - scaleFrom)})`,
});

export const OldInternetScene = () => {
  const frame = useCurrentFrame();
  const year2011In = interpolateClamped(
    frame,
    [OLD_BEATS.year2011, OLD_BEATS.year2011 + 12],
    [0, 1],
  );
  const year2011Out = interpolateClamped(
    frame,
    [OLD_BEATS.nyanMetric + 18, OLD_BEATS.year2012 - 4],
    [0, 1],
  );
  const nyanIn = interpolateClamped(
    frame,
    [OLD_BEATS.nyanReveal, OLD_BEATS.nyanReveal + 16],
    [0, 1],
  );
  const nyanMetric = interpolateClamped(
    frame,
    [OLD_BEATS.nyanMetric, OLD_BEATS.nyanMetric + 18],
    [0, 1],
  );
  const nyanCurve = interpolateClamped(
    frame,
    [OLD_BEATS.nyanChart, OLD_BEATS.nyanChart + 30],
    [0, 1],
  );
  const nyanOut = interpolateClamped(
    frame,
    [OLD_BEATS.year2012 - 3, OLD_BEATS.year2012 + 11],
    [0, 1],
  );
  const year2012In = interpolateClamped(
    frame,
    [OLD_BEATS.year2012, OLD_BEATS.year2012 + 12],
    [0, 1],
  );
  const year2012Out = interpolateClamped(
    frame,
    [OLD_BEATS.gangnamReveal, OLD_BEATS.gangnamReveal + 12],
    [0, 1],
  );
  const gangnamReveal = interpolateClamped(
    frame,
    [OLD_BEATS.gangnamReveal, OLD_BEATS.gangnamReveal + 22],
    [0, 1],
  );
  const gangnamProgress = interpolateClamped(
    frame,
    [OLD_BEATS.gangnamReveal + 2, OLD_BEATS.gangnamReveal + 45],
    [0, 1],
  );
  const gangnamCurve = interpolateClamped(
    frame,
    [OLD_BEATS.gangnamReveal + 8, OLD_BEATS.gangnamReveal + 66],
    [0, 1],
  );
  const statement = interpolateClamped(
    frame,
    [OLD_BEATS.lingerStatement, OLD_BEATS.lingerStatement + 10],
    [0, 1],
  );
  const statementBackdrop = interpolateClamped(
    frame,
    [OLD_BEATS.lingerStatement - 8, OLD_BEATS.lingerStatement + 2],
    [0, 1],
  );
  const sceneExit = interpolateClamped(
    frame,
    [OLD_BEATS.exit, SCENE_TIMING.oldInternet.duration],
    [0, 1],
  );

  return (
    <FilmBackground accent={NYAN.color} gridOpacity={0.22}>
      <AbsoluteFill
        style={{
          opacity: (1 - nyanOut) * (1 - sceneExit),
          transform: `translateX(${-sceneExit * 80}px)`,
        }}
      >
        <div
          style={{
            color: 'rgba(34,211,238,0.18)',
            fontSize: 270,
            fontWeight: 900,
            left: 74,
            letterSpacing: -14,
            lineHeight: 0.82,
            opacity: year2011In * (1 - year2011Out),
            position: 'absolute',
            top: 262,
            transform: `scale(${0.94 + year2011In * 0.06}) translateX(${-year2011Out * 42}px)`,
            transformOrigin: 'left center',
          }}
        >
          2011
        </div>

        <div style={{left: 84, position: 'absolute', top: 585, width: 912}}>
          <div
            style={{
              ...TYPOGRAPHY.eyebrow,
              ...enterStyle(nyanIn, 34),
              color: NYAN.color,
            }}
          >
            NYAN CAT
          </div>
          <div
            style={{
              ...TYPOGRAPHY.metric,
              ...enterStyle(nyanMetric, 72, 0.9),
              color: NYAN.color,
              marginTop: 40,
              textShadow: '0 0 30px rgba(34,211,238,0.16)',
              whiteSpace: 'nowrap',
            }}
          >
            ~9 MONTHS
          </div>
          <div
            style={{
              ...TYPOGRAPHY.secondary,
              ...enterStyle(nyanMetric, 28),
              color: COLORS.mutedText,
              marginTop: 20,
            }}
          >
            Search Attention Window
          </div>
        </div>

        <div
          style={{
            left: 60,
            opacity: nyanIn,
            position: 'absolute',
            top: 1000,
          }}
        >
          <AttentionChart
            trends={[NYAN]}
            activeTrendId="nyan-cat"
            width={960}
            height={510}
            chartId="scene-two-nyan-extend"
            showTickLabels={false}
            showAxisLabels={false}
            showThreshold={false}
            gridOpacity={0.2}
            curveProgress={{'nyan-cat': nyanCurve}}
          />
        </div>
        <div
          style={{
            color: COLORS.mutedText,
            fontSize: 26,
            fontWeight: 720,
            left: 166,
            letterSpacing: 1.2,
            opacity: nyanCurve,
            position: 'absolute',
            top: 1455,
          }}
        >
          PEAK
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 30,
            fontWeight: 760,
            letterSpacing: 0.6,
            opacity: nyanCurve,
            position: 'absolute',
            right: 80,
            top: 1455,
          }}
        >
          12 MONTHS
        </div>
        <SourceCaption style={{left: 84, opacity: nyanCurve, position: 'absolute', top: 1540}} />
      </AbsoluteFill>

      <div
        style={{
          color: 'rgba(244,114,182,0.2)',
          fontSize: 270,
          fontWeight: 900,
          left: 70,
          letterSpacing: -15,
          lineHeight: 0.82,
          opacity: year2012In * (1 - year2012Out),
          position: 'absolute',
          top: 500,
          transform: `translateX(${(1 - year2012In) * 100}px) scale(${0.94 + year2012In * 0.06})`,
          transformOrigin: 'left center',
        }}
      >
        2012
      </div>

      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${(1 - gangnamReveal) * 100}% 0 0)`,
          opacity: clamp01(gangnamReveal * 1.45) * (1 - sceneExit),
          transform: `translateX(${-sceneExit * 90}px)`,
        }}
      >
        <OldInternetState progress={gangnamProgress} curveProgress={gangnamCurve} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 61%, rgba(9,9,11,0.98) 69%, #09090b 76%)',
          opacity: statementBackdrop,
        }}
      />
      <div
        style={{
          color: COLORS.text,
          fontSize: 58,
          fontWeight: 850,
          left: 84,
          letterSpacing: -2.1,
          lineHeight: 1.02,
          opacity: statement * (1 - sceneExit),
          position: 'absolute',
          top: 1390,
          transform: `translateY(${(1 - statement) * 46}px)`,
          width: 900,
        }}
      >
        VIRAL ATTENTION
        <br />
        <span style={{color: '#f472b6'}}>USED TO LINGER.</span>
      </div>
    </FilmBackground>
  );
};
