import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  clamp01,
  impactEnvelope,
  interpolateClamped,
  SPRING_PRESETS,
} from './lib/animation';
import {
  HarlemState,
  HookState,
  ModernState,
  OldInternetState,
  PayoffState,
} from './visuals/HeroStates';

export const VISUAL_PROTOTYPE_DURATION = 445;

const sceneSpring = (frame: number, fps: number, durationInFrames: number): number =>
  clamp01(
    spring({
      frame,
      fps,
      config: SPRING_PRESETS.restrained,
      durationInFrames,
    }),
  );

const PrototypeHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = sceneSpring(frame, fps, 36);
  const exitProgress = interpolateClamped(frame, [64, 82], [0, 1]);
  const impactProgress = impactEnvelope(frame, 20, 14);

  return (
    <HookState
      progress={progress}
      exitProgress={exitProgress}
      impactProgress={impactProgress}
    />
  );
};

const PrototypeOldInternet = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = sceneSpring(frame, fps, 26);
  const progress = sceneSpring(frame, fps, 54);
  const curveProgress = interpolateClamped(frame, [8, 68], [0, 1]);
  const compression = interpolateClamped(frame, [80, 110], [0, 1]);

  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - entrance) * 100}% 0 0 0)`}}>
      <OldInternetState
        progress={progress}
        curveProgress={curveProgress}
        compression={compression}
      />
    </AbsoluteFill>
  );
};

const PrototypeHarlem = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = sceneSpring(frame, fps, 38);
  const progress = sceneSpring(frame, fps, 52);
  const magnifyProgress = interpolateClamped(frame, [0, 44], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${entrance * 132}% at 17% 52%)`,
        opacity: clamp01(entrance * 1.6),
      }}
    >
      <HarlemState progress={progress} magnifyProgress={magnifyProgress} />
    </AbsoluteFill>
  );
};

const PrototypeModern = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = sceneSpring(frame, fps, 24);
  const progress = sceneSpring(frame, fps, 50);
  const curveProgress = interpolateClamped(frame, [8, 56], [0, 1]);
  const cycleProgress = interpolateClamped(frame, [10, 104], [0, 1]);
  const exitProgress = interpolateClamped(frame, [96, 118], [0, 1]);

  return (
    <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - entrance) * 100}%)`}}>
      <ModernState
        progress={progress}
        curveProgress={curveProgress}
        cycleProgress={cycleProgress}
        exitProgress={exitProgress}
      />
    </AbsoluteFill>
  );
};

const PrototypePayoff = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = sceneSpring(frame, fps, 25);
  const progress = interpolateClamped(frame, [0, 48], [0, 1]);
  const attentionProgress = sceneSpring(frame - 56, fps, 25);

  return (
    <AbsoluteFill style={{clipPath: `circle(${entrance * 76}% at 50% 58%)`}}>
      <PayoffState progress={progress} attentionProgress={attentionProgress} />
    </AbsoluteFill>
  );
};

/** Temporary Phase 2 motion reel. This is intentionally not the final timeline. */
export const VisualPrototype = () => (
  <AbsoluteFill style={{background: '#09090b'}}>
    <Sequence durationInFrames={82} premountFor={20}>
      <PrototypeHook />
    </Sequence>
    <Sequence from={64} durationInFrames={140} premountFor={20}>
      <PrototypeOldInternet />
    </Sequence>
    <Sequence from={180} durationInFrames={112} premountFor={20}>
      <PrototypeHarlem />
    </Sequence>
    <Sequence from={270} durationInFrames={118} premountFor={20}>
      <PrototypeModern />
    </Sequence>
    <Sequence from={366} durationInFrames={79} premountFor={20}>
      <PrototypePayoff />
    </Sequence>
  </AbsoluteFill>
);
