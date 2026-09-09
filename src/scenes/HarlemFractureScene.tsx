import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SourceCaption} from '../components/SourceCaption';
import {clamp01, impactShake, interpolateClamped} from '../lib/animation';
import {COLORS} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground, HarlemState} from '../visuals/HeroStates';

const SCENE_START = SCENE_TIMING.fracture.start;
const localBeat = (globalFrame: number): number => globalFrame - SCENE_START;

const FRACTURE_BEATS = {
  patternInterrupt: localBeat(BEAT_TIMING.fracture.patternInterrupt),
  year2013: localBeat(BEAT_TIMING.fracture.year2013),
  harlemSpike: localBeat(BEAT_TIMING.fracture.harlemSpike),
  timelineCompress: localBeat(BEAT_TIMING.fracture.timelineCompress),
  weekMagnify: localBeat(BEAT_TIMING.fracture.weekMagnify),
  metricReveal: localBeat(BEAT_TIMING.fracture.metricReveal),
  intervalReveal: localBeat(BEAT_TIMING.fracture.halfCrossing),
} as const;

const MONTH_TICKS = [0, 3, 6, 9, 12] as const;
const TIMELINE_LEFT = 120;
const TIMELINE_WIDTH = 840;
const FIRST_MONTH_WIDTH = TIMELINE_WIDTH / 12;

interface TimelineCompressionProps {
  readonly entrance: number;
  readonly compression: number;
}

const TimelineCompression = ({
  entrance,
  compression,
}: TimelineCompressionProps) => {
  const compressedScale = 1 - compression * (11 / 12);
  const labelsOut = interpolateClamped(compression, [0.08, 0.38], [0, 1]);
  const focusIn = interpolateClamped(compression, [0.68, 1], [0, 1]);

  return (
    <AbsoluteFill style={{opacity: entrance}}>
      <div
        style={{
          color: COLORS.mutedText,
          fontSize: 27,
          fontWeight: 720,
          left: TIMELINE_LEFT,
          letterSpacing: 2.1,
          opacity: 1 - labelsOut,
          position: 'absolute',
          top: 890,
        }}
      >
        12-MONTH SEARCH TIMELINE
      </div>

      <svg
        height={430}
        viewBox="0 0 840 430"
        width={TIMELINE_WIDTH}
        style={{
          left: TIMELINE_LEFT,
          overflow: 'visible',
          position: 'absolute',
          top: 930,
          transform: `scaleX(${compressedScale})`,
          transformOrigin: 'left center',
        }}
      >
        <defs>
          <filter id="harlem-pulse-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1={0}
          x2={TIMELINE_WIDTH}
          y1={330}
          y2={330}
          stroke="#3f3f46"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 326 L 10 320 L 18 42 L 30 198 L 54 302 L 106 324 L 840 330"
          fill="none"
          pathLength={1}
          stroke="#fb7185"
          strokeDasharray={1}
          strokeDashoffset={1 - entrance}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={7}
          filter="url(#harlem-pulse-glow)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div style={{opacity: 1 - labelsOut}}>
        {MONTH_TICKS.map((month) => (
          <div
            key={month}
            style={{
              color: COLORS.mutedText,
              fontSize: 26,
              fontWeight: 650,
              left: TIMELINE_LEFT + (TIMELINE_WIDTH * month) / 12,
              position: 'absolute',
              top: 1300,
              transform: 'translateX(-50%)',
            }}
          >
            {month}
          </div>
        ))}
        <div
          style={{
            ...TYPOGRAPHY.chartAxis,
            left: TIMELINE_LEFT + TIMELINE_WIDTH / 2,
            position: 'absolute',
            top: 1370,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          MONTHS AFTER PEAK
        </div>
      </div>

      <div
        style={{
          background: 'rgba(251,113,133,0.055)',
          borderLeft: '2px solid #fb7185',
          borderRight: '2px solid #fb7185',
          height: 430,
          left: TIMELINE_LEFT,
          opacity: focusIn,
          position: 'absolute',
          top: 930,
          width: FIRST_MONTH_WIDTH,
        }}
      />
      <div
        style={{
          color: '#fb7185',
          fontSize: 28,
          fontWeight: 780,
          left: TIMELINE_LEFT,
          letterSpacing: 2,
          opacity: focusIn,
          position: 'absolute',
          top: 880,
          whiteSpace: 'nowrap',
        }}
      >
        FIRST MONTH
      </div>
    </AbsoluteFill>
  );
};

export const HarlemFractureScene = () => {
  const frame = useCurrentFrame();
  const thenIn = interpolateClamped(
    frame,
    [FRACTURE_BEATS.patternInterrupt, FRACTURE_BEATS.patternInterrupt + 10],
    [0, 1],
  );
  const thenOut = interpolateClamped(
    frame,
    [FRACTURE_BEATS.year2013 + 3, FRACTURE_BEATS.year2013 + 18],
    [0, 1],
  );
  const yearIn = interpolateClamped(
    frame,
    [FRACTURE_BEATS.year2013, FRACTURE_BEATS.year2013 + 12],
    [0, 1],
  );
  const yearOut = interpolateClamped(
    frame,
    [FRACTURE_BEATS.timelineCompress + 8, FRACTURE_BEATS.weekMagnify - 5],
    [0, 1],
  );
  const spike = interpolateClamped(
    frame,
    [FRACTURE_BEATS.harlemSpike, FRACTURE_BEATS.harlemSpike + 18],
    [0, 1],
  );
  const timelineEntrance = interpolateClamped(
    frame,
    [FRACTURE_BEATS.harlemSpike + 12, FRACTURE_BEATS.timelineCompress + 8],
    [0, 1],
  );
  const compression = interpolateClamped(
    frame,
    [FRACTURE_BEATS.timelineCompress, FRACTURE_BEATS.weekMagnify],
    [0, 1],
  );
  const harlemReveal = interpolateClamped(
    frame,
    [FRACTURE_BEATS.weekMagnify, FRACTURE_BEATS.weekMagnify + 26],
    [0, 1],
  );
  const harlemProgress = interpolateClamped(
    frame,
    [FRACTURE_BEATS.weekMagnify, FRACTURE_BEATS.metricReveal + 18],
    [0, 1],
  );
  const magnifyProgress = interpolateClamped(
    frame,
    [FRACTURE_BEATS.weekMagnify, FRACTURE_BEATS.intervalReveal],
    [0, 1],
  );
  const shakeX = impactShake(frame, FRACTURE_BEATS.harlemSpike + 8, 6);

  return (
    <FilmBackground accent="#fb7185" gridOpacity={0.1}>
      <div
        style={{
          color: COLORS.text,
          fontSize: 100,
          fontWeight: 880,
          left: 84,
          letterSpacing: -4.4,
          lineHeight: 0.92,
          opacity: thenIn * (1 - thenOut),
          position: 'absolute',
          top: 650,
          transform: `translateX(${(1 - thenIn) * 90 - thenOut * 70}px)`,
          width: 900,
        }}
      >
        THEN THIS
        <br />
        <span style={{color: '#fb7185'}}>HAPPENED.</span>
      </div>

      <div
        style={{
          left: 0,
          height: 1920,
          opacity: yearIn * (1 - yearOut),
          position: 'absolute',
          top: 0,
          transform: `translateX(${shakeX}px)`,
          width: 1080,
        }}
      >
        <div
          style={{
            color: 'rgba(251,113,133,0.18)',
            fontSize: 270,
            fontWeight: 900,
            left: 72,
            letterSpacing: -15,
            lineHeight: 0.82,
            position: 'absolute',
            top: 320,
          }}
        >
          2013
        </div>
        <div
          style={{
            ...TYPOGRAPHY.sectionTitle,
            color: COLORS.text,
            left: 84,
            position: 'absolute',
            top: 610,
            whiteSpace: 'nowrap',
          }}
        >
          HARLEM SHAKE
        </div>
        <div
          style={{
            background: '#fb7185',
            boxShadow: '0 0 24px rgba(251,113,133,0.22)',
            height: 470 * spike,
            left: 126,
            position: 'absolute',
            top: 830 + 470 * (1 - spike),
            width: 7,
          }}
        />
        <div
          style={{
            color: '#fb7185',
            fontSize: 26,
            fontWeight: 760,
            left: 154,
            letterSpacing: 2,
            opacity: spike,
            position: 'absolute',
            top: 825,
          }}
        >
          SEARCHES PEAK
        </div>
        <SourceCaption
          text="Google search interest"
          style={{left: 84, opacity: spike, position: 'absolute', top: 1360}}
        />
      </div>

      <div style={{opacity: 1 - harlemReveal}}>
        <TimelineCompression entrance={timelineEntrance} compression={compression} />
      </div>

      <AbsoluteFill
        style={{
          clipPath: `circle(${harlemReveal * 132}% at 17% 54%)`,
          opacity: clamp01(harlemReveal * 1.55),
        }}
      >
        <HarlemState
          progress={harlemProgress}
          magnifyProgress={magnifyProgress}
        />
      </AbsoluteFill>
    </FilmBackground>
  );
};
