import type {CSSProperties} from 'react';
import {clamp01} from '../lib/animation';
import {COLORS} from '../lib/theme';

export interface AttentionCycleProps {
  readonly progress?: number;
  readonly color?: string;
  readonly style?: CSSProperties;
}

interface AbstractCard {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly arrival: number;
  readonly lineWidths: readonly [number, number];
  readonly replacement?: boolean;
}

const ABSTRACT_CARDS: readonly AbstractCard[] = [
  {left: 30, top: 48, width: 274, height: 144, arrival: 0.02, lineWidths: [166, 106]},
  {left: 304, top: 10, width: 286, height: 154, arrival: 0.27, lineWidths: [188, 126]},
  {left: 592, top: 44, width: 246, height: 132, arrival: 0.32, lineWidths: [154, 112]},
  {left: 112, top: 170, width: 278, height: 144, arrival: 0.38, lineWidths: [176, 120]},
  {left: 422, top: 164, width: 250, height: 132, arrival: 0.46, lineWidths: [144, 92]},
  {left: 680, top: 184, width: 202, height: 122, arrival: 0.53, lineWidths: [118, 76]},
  {left: 8, top: 226, width: 228, height: 124, arrival: 0.57, lineWidths: [130, 90]},
  {left: 72, top: 108, width: 220, height: 118, arrival: 0.59, lineWidths: [126, 84]},
  {left: 610, top: 94, width: 238, height: 126, arrival: 0.61, lineWidths: [142, 96]},
  {left: 252, top: 244, width: 248, height: 126, arrival: 0.61, lineWidths: [142, 104]},
  {left: 188, top: 26, width: 232, height: 122, arrival: 0.64, lineWidths: [136, 90]},
  {left: 516, top: 232, width: 250, height: 132, arrival: 0.65, lineWidths: [148, 96]},
  {left: 554, top: 252, width: 226, height: 116, arrival: 0.67, lineWidths: [132, 86]},
  {left: 350, top: 202, width: 236, height: 124, arrival: 0.7, lineWidths: [140, 92]},
  {
    left: 330,
    top: 68,
    width: 318,
    height: 164,
    arrival: 0.78,
    lineWidths: [204, 142],
    replacement: true,
  },
];

const localProgress = (progress: number, start: number, duration: number): number =>
  clamp01((progress - start) / duration);

export const AttentionCycle = ({
  progress = 1,
  color = '#c084fc',
  style,
}: AttentionCycleProps) => {
  const cycleProgress = clamp01(progress);
  const clearProgress = localProgress(cycleProgress, 0.75, 0.17);

  return (
    <div
      aria-label="Abstract stream that multiplies, saturates, and is replaced"
      style={{height: 380, position: 'relative', width: 900, ...style}}
    >
      {ABSTRACT_CARDS.map((card, index) => {
        const entrance = localProgress(cycleProgress, card.arrival, 0.12);
        const isReplacement = card.replacement === true;
        const exit = isReplacement ? 0 : clearProgress;
        const translateX = isReplacement
          ? (1 - entrance) * 230
          : (1 - entrance) * (96 + index * 12) - exit * (180 + index * 12);
        const translateY = isReplacement ? 0 : exit * (index % 2 === 0 ? -34 : 46);
        const opacity = entrance * (1 - exit) * (isReplacement ? 0.94 : 0.58);

        return (
          <div
            key={`${card.left}-${card.top}`}
            style={{
              background: isReplacement
                ? 'linear-gradient(135deg, rgba(63,63,70,0.9), rgba(9,9,11,0.68))'
                : 'linear-gradient(135deg, rgba(39,39,42,0.82), rgba(9,9,11,0.42))',
              border: `1.5px solid ${isReplacement ? color : 'rgba(113,113,122,0.42)'}`,
              boxShadow: isReplacement
                ? `0 0 24px ${color}24`
                : '0 18px 46px rgba(0,0,0,0.28)',
              height: card.height,
              left: card.left,
              opacity,
              padding: 22,
              position: 'absolute',
              top: card.top,
              transform: `translate(${translateX}px, ${translateY}px) scale(${0.94 + entrance * 0.06})`,
              width: card.width,
            }}
          >
            <div
              style={{
                background: isReplacement ? color : COLORS.faintText,
                borderRadius: 999,
                height: 12,
                opacity: 0.8,
                width: 12,
              }}
            />
            <div
              style={{
                background: 'rgba(228,228,231,0.6)',
                height: 7,
                marginTop: 20,
                width: card.lineWidths[0],
              }}
            />
            <div
              style={{
                background: 'rgba(161,161,170,0.36)',
                height: 6,
                marginTop: 11,
                width: card.lineWidths[1],
              }}
            />
            <div
              style={{
                border: `2px solid ${color}`,
                borderRadius: 999,
                bottom: 14,
                height: 18,
                opacity: isReplacement || index % 2 === 0 ? 0.7 : 0.26,
                position: 'absolute',
                right: 16,
                width: 18,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
