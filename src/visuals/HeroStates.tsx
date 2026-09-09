import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {AttentionChart} from '../components/AttentionChart';
import {AttentionCycle} from '../components/AttentionCycle';
import {PageGrid} from '../components/Grid';
import {SourceCaption} from '../components/SourceCaption';
import {WeekZoomInset} from '../components/WeekZoomInset';
import {getTrendById, type AttentionTrend} from '../data/trendSummary';
import {clamp01} from '../lib/animation';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {VIEWER_TERMINOLOGY} from '../lib/terminology';
import {TYPOGRAPHY} from '../lib/typography';

const requireTrend = (id: string): AttentionTrend => {
  const trend = getTrendById(id);
  if (!trend) {
    throw new Error(`Missing trend: ${id}`);
  }
  return trend;
};

const NYAN = requireTrend('nyan-cat');
const GANGNAM = requireTrend('gangnam-style');
const GRIMACE = requireTrend('grimace-shake');
const OLD_TRENDS = [NYAN, GANGNAM] as const;
const MODERN_TRENDS = [NYAN, GANGNAM, GRIMACE] as const;

const rangeProgress = (progress: number, start: number, end: number): number =>
  clamp01((progress - start) / (end - start));

const riseStyle = (
  progress: number,
  distance = 54,
  scaleFrom = 0.97,
): CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px) scale(${scaleFrom + progress * (1 - scaleFrom)})`,
});

interface FilmBackgroundProps {
  readonly accent: string;
  readonly gridOpacity?: number;
  readonly children: ReactNode;
}

export const FilmBackground = ({accent, gridOpacity = 0.42, children}: FilmBackgroundProps) => (
  <AbsoluteFill
    style={{
      background: COLORS.background,
      color: COLORS.text,
      fontFamily: FONT_FAMILY,
      overflow: 'hidden',
    }}
  >
    <PageGrid style={{opacity: gridOpacity}} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 84% 18%, ${accent}18 0%, transparent 30%), radial-gradient(circle at 10% 72%, ${accent}0d 0%, transparent 38%)`,
      }}
    />
    <div
      style={{
        background: accent,
        height: 4,
        left: 80,
        opacity: 0.9,
        position: 'absolute',
        top: 180,
        width: 54,
      }}
    />
    {children}
  </AbsoluteFill>
);

interface HookStateProps {
  readonly progress?: number;
  readonly exitProgress?: number;
  readonly impactProgress?: number;
}

export const HookState = ({
  progress = 1,
  exitProgress = 0,
  impactProgress = 0,
}: HookStateProps) => {
  const eyebrow = rangeProgress(progress, 0, 0.22);
  const firstLine = rangeProgress(progress, 0.12, 0.45);
  const secondLine = rangeProgress(progress, 0.34, 0.7);
  const finalLine = rangeProgress(progress, 0.58, 1);
  const gridReveal = rangeProgress(progress, 0.5, 1);
  const impact = clamp01(impactProgress);
  const finalLineStyle = riseStyle(finalLine, 118, 0.9);

  return (
    <FilmBackground accent="#22d3ee" gridOpacity={0.14 * gridReveal}>
      <div
        style={{
          left: 82,
          position: 'absolute',
          top: 252,
          transform: `translateY(${-exitProgress * 110}px)`,
          width: 916,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.eyebrow,
            ...riseStyle(eyebrow, 24),
            color: '#22d3ee',
            marginBottom: 78,
          }}
        >
          SEARCH ATTENTION WINDOW
        </div>
        <div style={{height: 128, overflow: 'hidden'}}>
          <div style={{...TYPOGRAPHY.hook, ...riseStyle(firstLine, 92)}}>HOW LONG</div>
        </div>
        <div style={{height: 126, marginTop: 22, overflow: 'hidden'}}>
          <div
            style={{
              ...TYPOGRAPHY.hookMiddle,
              ...riseStyle(secondLine, 86),
              color: COLORS.mutedText,
            }}
          >
            DOES THE INTERNET
          </div>
        </div>
        <div style={{height: 238, marginTop: 14, overflow: 'visible'}}>
          <div
            style={{
              ...TYPOGRAPHY.hookDominant,
              ...finalLineStyle,
              textShadow: `0 0 ${30 + impact * 18}px rgba(34,211,238,${0.16 + impact * 0.08})`,
              transform: `${finalLineStyle.transform ?? ''} scale(${1 + impact * 0.035})`,
              transformOrigin: 'left center',
            }}
          >
            CARE
            <span
              style={{
                color: '#22d3ee',
                display: 'inline-block',
                transform: `scale(${1 + impact * 0.12})`,
                transformOrigin: 'center 70%',
              }}
            >
              ?
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          left: 65,
          opacity: 0.18 * gridReveal,
          position: 'absolute',
          top: 1080 + (1 - gridReveal) * 110,
        }}
      >
        <AttentionChart
          trends={OLD_TRENDS}
          activeTrendId="nyan-cat"
          width={950}
          height={620}
          chartId="hook-emerging-chart"
          showTickLabels={false}
          showAxisLabels={false}
          showThreshold={false}
          gridOpacity={0.5}
          curveProgress={{'nyan-cat': gridReveal, 'gangnam-style': gridReveal}}
          contextOpacity={0.32}
        />
      </div>

      <div
        style={{
          bottom: 278,
          color: COLORS.faintText,
          fontSize: 28,
          fontWeight: 650,
          left: 84,
          letterSpacing: 2.2,
          opacity: 0.72 * finalLine,
          position: 'absolute',
        }}
      >
        AFTER THE PEAK, HOW FAST DO WE LOOK AWAY?
      </div>
    </FilmBackground>
  );
};

interface OldInternetStateProps {
  readonly progress?: number;
  readonly curveProgress?: number;
  readonly compression?: number;
}

export const OldInternetState = ({
  progress = 1,
  curveProgress = 1,
  compression = 0,
}: OldInternetStateProps) => {
  const title = rangeProgress(progress, 0, 0.32);
  const metric = rangeProgress(progress, 0.2, 0.58);
  const chart = rangeProgress(progress, 0.32, 0.74);
  const detail = rangeProgress(progress, 0.68, 1);
  const compressionProgress = clamp01(compression);
  const compressedScale = 1 - compressionProgress * (11 / 12);
  const focusProgress = rangeProgress(compressionProgress, 0.72, 1);

  return (
    <FilmBackground accent={GANGNAM.color} gridOpacity={0.3}>
      <div
        style={{
          left: 84,
          opacity: 1 - compressionProgress * 0.76,
          position: 'absolute',
          top: 214,
          transform: `translateY(${-compressionProgress * 54}px)`,
          width: 912,
        }}
      >
        <div style={{...TYPOGRAPHY.eyebrow, ...riseStyle(title, 28), color: GANGNAM.color}}>
          2012 · OLD INTERNET
        </div>
        <div style={{...TYPOGRAPHY.sectionTitle, ...riseStyle(title, 58), marginTop: 32}}>
          GANGNAM STYLE
        </div>
        <div
          style={{
            ...TYPOGRAPHY.metricCompact,
            ...riseStyle(metric, 72, 0.93),
            color: GANGNAM.color,
            marginTop: 34,
            textShadow: '0 0 28px rgba(244,114,182,0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          ~4 MONTHS
        </div>
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            ...riseStyle(metric, 34),
            color: COLORS.mutedText,
            marginTop: 18,
          }}
        >
          {VIEWER_TERMINOLOGY.metric}
        </div>
      </div>

      <div
        style={{
          left: 60,
          opacity: chart * (1 - rangeProgress(compressionProgress, 0.12, 0.48)),
          position: 'absolute',
          top: 650,
        }}
      >
        <AttentionChart
          trends={OLD_TRENDS}
          activeTrendId="gangnam-style"
          width={960}
          height={730}
          chartId="old-internet-chart"
          curveProgress={{
            'nyan-cat': clamp01(curveProgress + 0.18),
            'gangnam-style': curveProgress,
          }}
          contextOpacity={0.2}
        />
      </div>

      <div
        style={{
          left: 60,
          opacity: chart * rangeProgress(compressionProgress, 0.12, 0.55),
          position: 'absolute',
          top: 650,
          transform: `scaleX(${compressedScale})`,
          transformOrigin: '108px center',
        }}
      >
        <AttentionChart
          trends={OLD_TRENDS}
          activeTrendId="gangnam-style"
          width={960}
          height={730}
          chartId="old-internet-compressed-chart"
          showTickLabels={false}
          showAxisLabels={false}
          showThreshold={false}
          curveProgress={{
            'nyan-cat': clamp01(curveProgress + 0.18),
            'gangnam-style': curveProgress,
          }}
          contextOpacity={0.2}
          gridOpacity={0.26}
        />
      </div>

      <div
        style={{
          background: 'rgba(244,114,182,0.055)',
          borderLeft: `2px solid ${GANGNAM.color}`,
          borderRight: `2px solid ${GANGNAM.color}`,
          height: 560,
          left: 168,
          opacity: focusProgress,
          position: 'absolute',
          top: 704,
          width: 68,
        }}
      />
      <div
        style={{
          color: GANGNAM.color,
          fontSize: 25,
          fontWeight: 760,
          left: 168,
          letterSpacing: 2.1,
          opacity: focusProgress,
          position: 'absolute',
          top: 656,
          whiteSpace: 'nowrap',
        }}
      >
        FIRST MONTH
      </div>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 16,
          left: 92,
          opacity: detail * (1 - compressionProgress),
          position: 'absolute',
          top: 1415,
        }}
      >
        <div style={{background: NYAN.color, borderRadius: 999, height: 11, width: 11}} />
        <div style={{...TYPOGRAPHY.body, color: COLORS.mutedText}}>
          NYAN CAT · ~9 MONTHS
        </div>
      </div>
      <SourceCaption
        style={{
          left: 84,
          opacity: detail * (1 - compressionProgress),
          position: 'absolute',
          top: 1510,
        }}
      />
    </FilmBackground>
  );
};

interface HarlemStateProps {
  readonly progress?: number;
  readonly magnifyProgress?: number;
}

export const HarlemState = ({progress = 1, magnifyProgress = 1}: HarlemStateProps) => {
  const title = rangeProgress(progress, 0, 0.28);
  const metric = rangeProgress(progress, 0.2, 0.58);
  const inset = rangeProgress(progress, 0.34, 0.78);
  const magnify = clamp01(magnifyProgress);

  return (
    <FilmBackground accent="#fb7185" gridOpacity={0.18}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(118deg, transparent 0%, transparent 47%, rgba(251,113,133,0.055) 48%, transparent 62%)',
        }}
      />
      <div style={{left: 84, position: 'absolute', top: 214, width: 912}}>
        <div style={{...TYPOGRAPHY.eyebrow, ...riseStyle(title, 28), color: '#fb7185'}}>
          2013 · HARLEM SHAKE
        </div>
        <div style={{...TYPOGRAPHY.sectionTitle, ...riseStyle(title, 58), marginTop: 36}}>
          MONTHS <span style={{color: '#fb7185'}}>→</span> WEEKS
        </div>
        <div
          style={{
            ...TYPOGRAPHY.metric,
            ...riseStyle(metric, 84, 0.88),
            color: '#fb7185',
            marginTop: 56,
            textShadow: '0 0 34px rgba(251,113,133,0.18)',
          }}
        >
          ~2–3 WEEKS
        </div>
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            ...riseStyle(metric, 32),
            color: COLORS.mutedText,
            marginTop: 22,
          }}
        >
          {VIEWER_TERMINOLOGY.metric}
        </div>
      </div>

      <div
        style={{
          left: 80,
          opacity: inset,
          position: 'absolute',
          top: 760,
          transform: `scale(${0.12 + magnify * 0.88})`,
          transformOrigin: '9.5% 45%',
        }}
      >
        <WeekZoomInset interval={[2, 3]} width={920} height={620} color="#fb7185" progress={inset} />
      </div>
      <SourceCaption
        text="Google search interest · public week-level evidence"
        style={{left: 84, opacity: inset, position: 'absolute', top: 1460}}
      />
    </FilmBackground>
  );
};

interface ModernStateProps {
  readonly progress?: number;
  readonly curveProgress?: number;
  readonly cycleProgress?: number;
  readonly exitProgress?: number;
}

const CYCLE_WORDS = ['TREND.', 'REMIX.', 'SATURATE.', 'REPLACE.'] as const;

const cycleWordOpacity = (progress: number, index: number): number => {
  const stageLength = 1 / CYCLE_WORDS.length;
  const start = index * stageLength;
  const end = start + stageLength;
  const entrance = rangeProgress(progress, start, start + 0.045);

  if (index === CYCLE_WORDS.length - 1) {
    return entrance;
  }

  return entrance * (1 - rangeProgress(progress, end - 0.045, end));
};

export const ModernState = ({
  progress = 1,
  curveProgress = 1,
  cycleProgress = 1,
  exitProgress = 0,
}: ModernStateProps) => {
  const title = rangeProgress(progress, 0, 0.28);
  const metric = rangeProgress(progress, 0.18, 0.54);
  const chart = rangeProgress(progress, 0.35, 0.78);
  const content = rangeProgress(progress, 0.5, 1);

  return (
    <FilmBackground accent={GRIMACE.color} gridOpacity={0.24}>
      <div
        style={{
          left: 84,
          position: 'absolute',
          top: 214,
          transform: `translateX(${-exitProgress * 120}px)`,
          width: 912,
        }}
      >
        <div style={{...TYPOGRAPHY.eyebrow, ...riseStyle(title, 28), color: GRIMACE.color}}>
          2023 · MODERN CYCLE
        </div>
        <div style={{...TYPOGRAPHY.sectionTitle, ...riseStyle(title, 56), marginTop: 32}}>
          GRIMACE SHAKE
        </div>
        <div
          style={{
            ...TYPOGRAPHY.metricWide,
            ...riseStyle(metric, 76, 0.92),
            color: GRIMACE.color,
            marginTop: 36,
            textShadow: '0 0 30px rgba(192,132,252,0.17)',
            whiteSpace: 'nowrap',
          }}
        >
          ~1–2 MONTHS
        </div>
      </div>

      <AttentionCycle
        color={GRIMACE.color}
        progress={cycleProgress}
        style={{
          left: 90,
          maskImage: 'linear-gradient(to bottom, black 0%, black 42%, transparent 100%)',
          opacity: content * 0.46,
          position: 'absolute',
          top: 585,
          transform: `translateX(${exitProgress * 220}px)`,
        }}
      />
      <div
        style={{
          left: 96,
          opacity: content,
          position: 'absolute',
          top: 672,
          width: 888,
        }}
      >
        {CYCLE_WORDS.map((word, index) => {
          const wordOpacity = cycleWordOpacity(cycleProgress, index);
          return (
            <div
              key={word}
              style={{
                ...TYPOGRAPHY.secondary,
                color: index === CYCLE_WORDS.length - 1 ? GRIMACE.color : COLORS.mutedText,
                fontWeight: 800,
                left: 0,
                letterSpacing: 1.2,
                opacity: wordOpacity,
                position: 'absolute',
                transform: `translateX(${(1 - wordOpacity) * 42}px)`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      <div
        style={{
          left: 60,
          opacity: chart,
          position: 'absolute',
          top: 780,
          transform: `translateX(${-exitProgress * 90}px)`,
        }}
      >
        <AttentionChart
          trends={MODERN_TRENDS}
          activeTrendId="grimace-shake"
          width={960}
          height={680}
          chartId="modern-cycle-chart"
          curveProgress={{'nyan-cat': 1, 'gangnam-style': 1, 'grimace-shake': curveProgress}}
          contextOpacity={0.1}
          showYAxisLabel={false}
        />
      </div>
      <SourceCaption style={{left: 84, opacity: chart, position: 'absolute', top: 1500}} />
    </FilmBackground>
  );
};

interface PayoffStateProps {
  readonly progress?: number;
  readonly attentionProgress?: number;
}

export const PayoffState = ({progress = 1, attentionProgress = 1}: PayoffStateProps) => {
  const first = rangeProgress(progress, 0, 0.34);
  const second = rangeProgress(progress, 0.28, 0.62);
  const finalLead = rangeProgress(progress, 0.52, 0.78);
  const attention = clamp01(attentionProgress) * rangeProgress(progress, 0.68, 1);

  return (
    <FilmBackground accent="#22d3ee" gridOpacity={0}>
      <div style={{left: 82, position: 'absolute', top: 340, width: 916}}>
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            ...riseStyle(first, 32),
            color: COLORS.mutedText,
            letterSpacing: 1.2,
          }}
        >
          THE INTERNET ISN'T
        </div>
        <div style={{...TYPOGRAPHY.payoff, ...riseStyle(second, 68), marginTop: 28}}>
          RUNNING OUT
          <br />
          OF MEMES.
        </div>
        <div
          style={{
            background: 'linear-gradient(90deg, #3f3f46, transparent)',
            height: 2,
            marginTop: 118,
            opacity: finalLead,
            width: 510,
          }}
        />
        <div
          style={{
            ...TYPOGRAPHY.secondary,
            ...riseStyle(finalLead, 38),
            color: COLORS.mutedText,
            letterSpacing: 1.2,
            marginTop: 104,
          }}
        >
          IT'S RUNNING OUT OF
        </div>
        <div
          style={{
            ...TYPOGRAPHY.payoffDominant,
            color: COLORS.text,
            marginTop: 38,
            opacity: attention,
            textShadow: '0 0 34px rgba(34,211,238,0.15)',
            transform: `scale(${0.84 + attention * 0.16}) scaleX(0.77)`,
            transformOrigin: 'left center',
          }}
        >
          ATTENTION<span style={{color: '#22d3ee'}}>.</span>
        </div>
      </div>
    </FilmBackground>
  );
};
