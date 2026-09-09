import type {CSSProperties} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {interpolateClamped} from '../lib/animation';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground} from '../visuals/HeroStates';

const localBeat = (absoluteFrame: number): number =>
  absoluteFrame - SCENE_TIMING.payoff.start;

export const attentionWordStyle: CSSProperties = {
  ...TYPOGRAPHY.payoffDominant,
  color: COLORS.text,
  left: 82,
  position: 'absolute',
  textShadow: '0 0 34px rgba(34,211,238,0.15)',
  top: 1048,
  transformOrigin: 'left center',
  whiteSpace: 'nowrap',
};

export const AttentionWord = ({
  opacity = 1,
  scale = 1,
  translateY = 0,
}: {
  readonly opacity?: number;
  readonly scale?: number;
  readonly translateY?: number;
}) => (
  <div
    style={{
      ...attentionWordStyle,
      opacity,
      transform: `translateY(${translateY}px) scale(${scale}) scaleX(0.77)`,
    }}
  >
    ATTENTION<span style={{color: '#22d3ee'}}>.</span>
  </div>
);

export const PayoffScene = () => {
  const frame = useCurrentFrame();
  const premiseAt = localBeat(BEAT_TIMING.payoff.premise);
  const memesAt = localBeat(BEAT_TIMING.payoff.memes);
  const leadAt = localBeat(BEAT_TIMING.payoff.finalLead);
  const attentionAt = localBeat(BEAT_TIMING.payoff.attention);
  const premise = interpolateClamped(frame, [premiseAt, premiseAt + 8], [0, 1]);
  const memes = interpolateClamped(frame, [memesAt, memesAt + 10], [0, 1]);
  const lead = interpolateClamped(frame, [leadAt, leadAt + 9], [0, 1]);
  const attention = interpolateClamped(frame, [attentionAt, attentionAt + 12], [0, 1]);
  const copyOut = interpolateClamped(frame, [attentionAt - 4, attentionAt + 8], [1, 0]);

  return (
    <FilmBackground accent="#22d3ee" gridOpacity={0}>
      <AbsoluteFill style={{color: COLORS.text, fontFamily: FONT_FAMILY}}>
        <div
          style={{
            left: 82,
            opacity: copyOut,
            position: 'absolute',
            top: 340,
            width: 916,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.secondary,
              color: COLORS.mutedText,
              letterSpacing: 1.2,
              opacity: premise,
              transform: `translateY(${(1 - premise) * 32}px)`,
            }}
          >
            THE INTERNET ISN'T
          </div>
          <div
            style={{
              ...TYPOGRAPHY.payoff,
              marginTop: 28,
              opacity: memes,
              transform: `translateY(${(1 - memes) * 68}px)`,
            }}
          >
            RUNNING OUT
            <br />
            OF MEMES.
          </div>
          <div
            style={{
              ...TYPOGRAPHY.secondary,
              color: COLORS.mutedText,
              letterSpacing: 1.2,
              marginTop: 192,
              opacity: lead,
              transform: `translateY(${(1 - lead) * 38}px)`,
            }}
          >
            IT'S RUNNING OUT OF...
          </div>
        </div>
        <AttentionWord
          opacity={attention}
          scale={0.84 + attention * 0.16}
          translateY={(1 - attention) * 72}
        />
      </AbsoluteFill>
    </FilmBackground>
  );
};
