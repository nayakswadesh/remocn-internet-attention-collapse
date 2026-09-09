import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {interpolateClamped} from '../lib/animation';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';
import {TYPOGRAPHY} from '../lib/typography';
import {FilmBackground} from '../visuals/HeroStates';
import {AttentionWord} from './PayoffScene';

const localBeat = (absoluteFrame: number): number =>
  absoluteFrame - SCENE_TIMING.loop.start;

export const LoopScene = () => {
  const frame = useCurrentFrame();
  const bridgeAt = localBeat(BEAT_TIMING.loop.bridge);
  const returnAt = localBeat(BEAT_TIMING.loop.returnToHook);
  const attentionOut = interpolateClamped(frame, [0, bridgeAt + 5], [1, 0]);
  const bridgeIn = interpolateClamped(frame, [bridgeAt, bridgeAt + 7], [0, 1]);
  const bridgeOut = interpolateClamped(
    frame,
    [returnAt, SCENE_TIMING.loop.duration - 1],
    [1, 0],
  );

  return (
    <FilmBackground accent="#22d3ee" gridOpacity={0}>
      <AbsoluteFill style={{color: COLORS.text, fontFamily: FONT_FAMILY}}>
        <AttentionWord
          opacity={attentionOut}
          scale={1 - (1 - attentionOut) * 0.035}
          translateY={(1 - attentionOut) * -18}
        />
        <div
          style={{
            ...TYPOGRAPHY.hook,
            left: 82,
            opacity: bridgeIn * bridgeOut,
            position: 'absolute',
            top: 718,
            transform: `translateY(${(1 - bridgeIn) * 36}px)`,
          }}
        >
          SO<span style={{color: '#22d3ee'}}>...</span>
        </div>
      </AbsoluteFill>
    </FilmBackground>
  );
};
