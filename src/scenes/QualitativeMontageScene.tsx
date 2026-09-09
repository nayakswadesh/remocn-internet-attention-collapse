import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {interpolateClamped} from '../lib/animation';
import {COLORS} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground} from '../visuals/HeroStates';

const SCENE_START = SCENE_TIMING.qualitativeMontage.start;
const localBeat = (globalFrame: number): number => globalFrame - SCENE_START;

const BEATS = {
  viral: localBeat(BEAT_TIMING.qualitativeMontage.viral),
  everywhere: localBeat(BEAT_TIMING.qualitativeMontage.everywhere),
  overused: localBeat(BEAT_TIMING.qualitativeMontage.overused),
  next: localBeat(BEAT_TIMING.qualitativeMontage.next),
  silence: localBeat(BEAT_TIMING.qualitativeMontage.silence),
} as const;

interface CloudWord {
  readonly left: number;
  readonly top: number;
  readonly size: number;
  readonly rotate: number;
  readonly word: 'VIRAL' | 'EVERYWHERE';
}

const VIRAL_COPIES: readonly CloudWord[] = Array.from({length: 12}, (_, index) => ({
  left: 44 + ((index * 173) % 850),
  top: 390 + ((index * 127) % 850),
  size: 34 + (index % 3) * 10,
  rotate: (index % 5 - 2) * 3,
  word: 'VIRAL' as const,
}));

const SATURATION_CLOUD: readonly CloudWord[] = Array.from(
  {length: 28},
  (_, index) => ({
    left: -70 + ((index * 149) % 1040),
    top: 300 + ((index * 83) % 1080),
    size: 28 + (index % 4) * 11,
    rotate: (index % 7 - 3) * 4,
    word: index % 3 === 0 ? ('EVERYWHERE' as const) : ('VIRAL' as const),
  }),
);

const stageOpacity = (
  frame: number,
  start: number,
  end: number,
): number => {
  const enter = interpolateClamped(frame, [start, start + 6], [0, 1]);
  const exit = interpolateClamped(frame, [end, end + 6], [0, 1]);
  return enter * (1 - exit);
};

export const QualitativeMontageScene = () => {
  const frame = useCurrentFrame();
  const viral = stageOpacity(frame, BEATS.viral, BEATS.everywhere);
  const everywhere = stageOpacity(frame, BEATS.everywhere, BEATS.overused);
  const overused = stageOpacity(frame, BEATS.overused, BEATS.next);
  const next = stageOpacity(frame, BEATS.next, BEATS.silence);
  const clearNoise = interpolateClamped(frame, [BEATS.next, BEATS.next + 8], [0, 1]);
  const silence = interpolateClamped(frame, [BEATS.silence - 1, BEATS.silence], [0, 1]);
  const duplicateBuild = interpolateClamped(
    frame,
    [BEATS.everywhere, BEATS.everywhere + 18],
    [0, 1],
  );
  const saturationBuild = interpolateClamped(
    frame,
    [BEATS.overused, BEATS.overused + 18],
    [0, 1],
  );

  return (
    <FilmBackground accent="#f4f4f5" gridOpacity={0.08}>
      <AbsoluteFill style={{opacity: 1 - silence}}>
        <div
          style={{
            ...TYPOGRAPHY.eyebrow,
            color: COLORS.mutedText,
            left: 84,
            opacity: 1 - clearNoise,
            position: 'absolute',
            top: 220,
          }}
        >
          6–7 · QUALITATIVE EXAMPLE
        </div>

        {VIRAL_COPIES.map((item, index) => {
          const arrival = interpolateClamped(
            duplicateBuild,
            [index / VIRAL_COPIES.length, index / VIRAL_COPIES.length + 0.2],
            [0, 1],
          );

          return (
            <div
              key={`viral-${index}`}
              style={{
                color: index % 4 === 0 ? COLORS.text : COLORS.faintText,
                fontSize: item.size,
                fontWeight: 820,
                left: item.left,
                opacity: arrival * everywhere * 0.62,
                position: 'absolute',
                top: item.top,
                transform: `translate(${(1 - arrival) * 80 - clearNoise * 260}px, ${(1 - arrival) * 30}px) rotate(${item.rotate}deg)`,
                whiteSpace: 'nowrap',
              }}
            >
              {item.word}
            </div>
          );
        })}

        {SATURATION_CLOUD.map((item, index) => {
          const arrival = interpolateClamped(
            saturationBuild,
            [index / SATURATION_CLOUD.length, index / SATURATION_CLOUD.length + 0.16],
            [0, 1],
          );
          const direction = index % 2 === 0 ? -1 : 1;

          return (
            <div
              key={`saturation-${index}`}
              style={{
                color: index % 5 === 0 ? COLORS.text : COLORS.faintText,
                fontSize: item.size,
                fontWeight: 820,
                left: item.left,
                opacity: arrival * overused * 0.56,
                position: 'absolute',
                top: item.top,
                transform: `translate(${(1 - arrival) * direction * 110 + clearNoise * direction * 360}px, ${clearNoise * (index % 3 - 1) * 120}px) rotate(${item.rotate}deg) scale(${0.9 + arrival * 0.1})`,
                whiteSpace: 'nowrap',
              }}
            >
              {item.word}
            </div>
          );
        })}

        <div
          style={{
            color: COLORS.text,
            fontSize: 196,
            fontWeight: 900,
            left: 80,
            letterSpacing: -9,
            opacity: viral,
            position: 'absolute',
            top: 690,
            transform: `translateY(${(1 - viral) * 70}px) scale(${0.9 + viral * 0.1})`,
            transformOrigin: 'left center',
          }}
        >
          VIRAL
        </div>

        <div
          style={{
            color: COLORS.text,
            fontSize: 114,
            fontWeight: 900,
            left: 78,
            letterSpacing: -5.6,
            opacity: everywhere,
            position: 'absolute',
            top: 710,
            transform: `scale(${0.9 + everywhere * 0.1})`,
            transformOrigin: 'left center',
          }}
        >
          EVERYWHERE
        </div>

        <div
          style={{
            background: 'rgba(9,9,11,0.86)',
            borderLeft: '6px solid #f4f4f5',
            color: COLORS.text,
            fontSize: 126,
            fontWeight: 900,
            left: 72,
            letterSpacing: -6,
            opacity: overused,
            padding: '38px 38px 46px 42px',
            position: 'absolute',
            top: 670,
            transform: `scale(${0.92 + overused * 0.08})`,
            transformOrigin: 'left center',
          }}
        >
          OVERUSED
        </div>

        <div
          style={{
            color: COLORS.text,
            fontSize: 224,
            fontWeight: 900,
            left: 78,
            letterSpacing: -11,
            opacity: next,
            position: 'absolute',
            top: 655,
            transform: `translateX(${(1 - next) * 100}px) scale(${0.9 + next * 0.1})`,
            transformOrigin: 'left center',
          }}
        >
          NEXT<span style={{color: '#a1a1aa'}}>.</span>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: '#09090b',
          opacity: silence,
        }}
      />
    </FilmBackground>
  );
};
