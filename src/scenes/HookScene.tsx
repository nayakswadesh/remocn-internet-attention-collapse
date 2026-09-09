import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HookState} from '../visuals/HeroStates';
import {
  impactEnvelope,
  interpolateClamped,
} from '../lib/animation';
import {BEAT_TIMING, SCENE_TIMING} from '../lib/timing';

export const HookScene = () => {
  const frame = useCurrentFrame();
  const beats = BEAT_TIMING.coldOpen;
  const progress = interpolateClamped(
    frame,
    [beats.howLong, beats.care + 24],
    [0, 1],
  );
  const pull = interpolateClamped(
    frame,
    [beats.timelinePull, SCENE_TIMING.coldOpen.endExclusive - 1],
    [0, 1],
  );
  const exitOpacity = interpolateClamped(
    frame,
    [SCENE_TIMING.coldOpen.endExclusive - 10, SCENE_TIMING.coldOpen.endExclusive],
    [1, 0],
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `translateY(${-pull * 92}px) scale(${1 + pull * 0.2})`,
        transformOrigin: '50% 68%',
      }}
    >
      <HookState
        progress={progress}
        exitProgress={pull * 0.28}
        impactProgress={impactEnvelope(frame, beats.questionImpact, 14)}
      />
    </AbsoluteFill>
  );
};
