import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PageGrid} from '../components/Grid';
import {SourceCaption} from '../components/SourceCaption';
import {TrendCurve} from '../components/TrendCurve';
import {
  getTrendById,
  type MonthlyAttentionTrend,
} from '../data/trendSummary';
import {interpolateClamped} from '../lib/animation';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';

const requireMonthlyTrend = (id: string): MonthlyAttentionTrend => {
  const trend = getTrendById(id);

  if (!trend || trend.resolution !== 'monthly-google-trends') {
    throw new Error(`Missing monthly trend: ${id}`);
  }

  return trend;
};

const NYAN = requireMonthlyTrend('nyan-cat');
const GANGNAM = requireMonthlyTrend('gangnam-style');
const ICE_BUCKET = requireMonthlyTrend('ice-bucket-challenge');
const MANNEQUIN = requireMonthlyTrend('mannequin-challenge');
const COFFIN = requireMonthlyTrend('coffin-dance');
const GRIMACE = requireMonthlyTrend('grimace-shake');

interface EvidenceMiniChartProps {
  readonly id: string;
  readonly primary: MonthlyAttentionTrend;
  readonly context: MonthlyAttentionTrend;
  readonly progress: number;
}

const EvidenceMiniChart = ({
  id,
  primary,
  context,
  progress,
}: EvidenceMiniChartProps) => {
  const bounds = {x: 10, y: 18, width: 276, height: 190} as const;
  const clipPathId = `${id}-clip`;

  return (
    <svg height={230} viewBox="0 0 296 230" width={296} style={{overflow: 'visible'}}>
      <defs>
        <clipPath id={clipPathId}>
          <rect x={-14} y={-6} width={324} height={238} />
        </clipPath>
      </defs>
      <line
        x1={bounds.x}
        x2={bounds.x + bounds.width}
        y1={bounds.y + bounds.height}
        y2={bounds.y + bounds.height}
        stroke="#3f3f46"
        strokeOpacity={0.52}
        strokeWidth={2}
      />
      <TrendCurve
        trend={context}
        bounds={bounds}
        maxMonths={12}
        clipPathId={clipPathId}
        progress={progress}
        contextOpacity={0.18}
        showArea={false}
        showMarkers={false}
      />
      <TrendCurve
        active
        trend={primary}
        bounds={bounds}
        maxMonths={12}
        clipPathId={clipPathId}
        progress={progress}
        showArea={false}
        showMarkers={false}
      />
    </svg>
  );
};

const GROUPS = [
  {
    label: 'LONG TAILS',
    detail: 'COFFIN DANCE · ~4 MONTHS',
    primary: COFFIN,
    context: NYAN,
    start: BEAT_TIMING.zoomOut.longTails - SCENE_TIMING.zoomOut.start,
  },
  {
    label: 'VOLATILE CYCLES',
    detail: 'GRIMACE · LATE RESURGENCE',
    primary: GRIMACE,
    context: GANGNAM,
    start: BEAT_TIMING.zoomOut.volatileCycles - SCENE_TIMING.zoomOut.start,
  },
  {
    label: 'FAST ATTENTION\nWINDOWS',
    detail: 'ICE BUCKET · <1 MONTH',
    primary: ICE_BUCKET,
    context: MANNEQUIN,
    start: BEAT_TIMING.zoomOut.fastWindows - SCENE_TIMING.zoomOut.start,
  },
] as const;

export const ZoomOutScene = () => {
  const frame = useCurrentFrame();
  const beat = Object.fromEntries(
    Object.entries(BEAT_TIMING.zoomOut).map(([key, value]) => [
      key,
      value - SCENE_TIMING.zoomOut.start,
    ]),
  ) as {[Key in keyof typeof BEAT_TIMING.zoomOut]: number};
  const breathe = interpolateClamped(frame, [beat.breathe, beat.breathe + 10], [0, 1]);
  const firstLine = interpolateClamped(frame, [beat.patternFirst, beat.patternFirst + 10], [0, 1]);
  const secondLine = interpolateClamped(frame, [beat.patternSecond, beat.patternSecond + 11], [0, 1]);
  const evidenceIn = interpolateClamped(frame, [beat.evidence, beat.evidence + 12], [0, 1]);
  const conclusionIn = interpolateClamped(frame, [beat.conclusion, beat.conclusion + 12], [0, 1]);
  const conclusionSecond = interpolateClamped(frame, [beat.conclusionSecond, beat.conclusionSecond + 12], [0, 1]);
  const conclusionFinal = interpolateClamped(frame, [beat.conclusionFinal, beat.conclusionFinal + 12], [0, 1]);
  const evidenceOut = interpolateClamped(frame, [beat.conclusion - 1, beat.conclusion + 13], [0, 1]);
  const sceneExit = interpolateClamped(
    frame,
    [beat.exit, SCENE_TIMING.zoomOut.duration],
    [0, 1],
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
      }}
    >
      <PageGrid style={{opacity: breathe * 0.09 * (1 - sceneExit)}} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 56%, rgba(34,211,238,0.045), transparent 46%)',
          opacity: breathe * (1 - sceneExit),
        }}
      />
      <div
        style={{
          background: '#22d3ee',
          height: 4,
          left: 80,
          opacity: breathe * 0.9 * (1 - sceneExit),
          position: 'absolute',
          top: 180,
          width: 54,
        }}
      />

      <div
        style={{
          left: 84,
          opacity: (1 - evidenceOut) * (1 - sceneExit),
          position: 'absolute',
          top: 330,
          width: 912,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            color: COLORS.mutedText,
            opacity: firstLine,
            transform: `translateY(${(1 - firstLine) * 34}px)`,
          }}
        >
          THE PATTERN
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 870,
            letterSpacing: -4,
            lineHeight: 0.94,
            marginTop: 22,
            opacity: secondLine,
            transform: `translateY(${(1 - secondLine) * 48}px)`,
          }}
        >
          ISN'T PERFECT<span style={{color: COFFIN.color}}>.</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 18,
          left: 66,
          opacity: evidenceIn * (1 - evidenceOut) * (1 - sceneExit),
          position: 'absolute',
          top: 730,
          width: 948,
        }}
      >
        {GROUPS.map((group) => {
          const groupIn = interpolateClamped(frame, [group.start, group.start + 10], [0, 1]);
          const curve = interpolateClamped(frame, [group.start + 5, group.start + 34], [0, 1]);

          return (
            <div
              key={group.label}
              style={{
                opacity: groupIn,
                transform: `translateY(${(1 - groupIn) * 38}px)`,
                width: 304,
              }}
            >
              <div
                style={{
                  color: group.primary.color,
                  fontSize: 25,
                  fontWeight: 790,
                  letterSpacing: 1.7,
                  lineHeight: 1.05,
                  minHeight: 58,
                  whiteSpace: 'pre-line',
                }}
              >
                {group.label}
              </div>
              <EvidenceMiniChart
                id={`zoom-out-${group.primary.id}`}
                primary={group.primary}
                context={group.context}
                progress={curve}
              />
              <div
                style={{
                  color: COLORS.mutedText,
                  fontSize: 24,
                  fontWeight: 660,
                  letterSpacing: 0.3,
                  marginTop: 16,
                }}
              >
                {group.detail}
              </div>
            </div>
          );
        })}
      </div>

      <SourceCaption
        style={{
          left: 84,
          opacity: evidenceIn * (1 - evidenceOut),
          position: 'absolute',
          top: 1250,
        }}
      />

      <div
        style={{
          left: 84,
          opacity: 1 - sceneExit,
          position: 'absolute',
          top: 570,
          width: 912,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            color: COLORS.mutedText,
            opacity: conclusionIn,
            transform: `translateY(${(1 - conclusionIn) * 34}px)`,
          }}
        >
          BUT VIRAL ATTENTION
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 870,
            letterSpacing: -3.8,
            lineHeight: 0.98,
            marginTop: 30,
            opacity: conclusionSecond,
            transform: `translateY(${(1 - conclusionSecond) * 42}px)`,
          }}
        >
          CAN NOW COLLAPSE
        </div>
        <div
          style={{
            color: '#fb7185',
            fontSize: 154,
            fontWeight: 900,
            letterSpacing: -7,
            lineHeight: 0.9,
            marginTop: 30,
            opacity: conclusionFinal,
            textShadow: '0 0 28px rgba(251,113,133,0.13)',
            transform: `translateY(${(1 - conclusionFinal) * 54}px)`,
          }}
        >
          IN WEEKS.
        </div>
      </div>
    </AbsoluteFill>
  );
};
