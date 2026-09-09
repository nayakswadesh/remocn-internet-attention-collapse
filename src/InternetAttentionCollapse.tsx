import {AbsoluteFill, Sequence} from 'remotion';
import {ExceptionsScene} from './scenes/ExceptionsScene';
import {HarlemFractureScene} from './scenes/HarlemFractureScene';
import {HookScene} from './scenes/HookScene';
import {ModernCycleScene} from './scenes/ModernCycleScene';
import {OldInternetScene} from './scenes/OldInternetScene';
import {PayoffScene} from './scenes/PayoffScene';
import {QualitativeMontageScene} from './scenes/QualitativeMontageScene';
import {LoopScene} from './scenes/LoopScene';
import {ZoomOutScene} from './scenes/ZoomOutScene';
import {SCENE_TIMING} from './lib/timing';

/**
 * All scenes use their final production timing.
 */
export const InternetAttentionCollapse = () => (
  <AbsoluteFill style={{background: '#09090b'}}>
    <Sequence durationInFrames={SCENE_TIMING.coldOpen.duration} premountFor={20}>
      <HookScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.oldInternet.start}
      durationInFrames={SCENE_TIMING.oldInternet.duration}
      premountFor={20}
    >
      <OldInternetScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.fracture.start}
      durationInFrames={SCENE_TIMING.fracture.duration}
      premountFor={20}
    >
      <HarlemFractureScene />
    </Sequence>

    <Sequence
      from={SCENE_TIMING.exceptions.start}
      durationInFrames={SCENE_TIMING.exceptions.duration}
      premountFor={20}
    >
      <ExceptionsScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.modernCycle.start}
      durationInFrames={SCENE_TIMING.modernCycle.duration}
      premountFor={20}
    >
      <ModernCycleScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.qualitativeMontage.start}
      durationInFrames={SCENE_TIMING.qualitativeMontage.duration}
      premountFor={20}
    >
      <QualitativeMontageScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.zoomOut.start}
      durationInFrames={SCENE_TIMING.zoomOut.duration}
      premountFor={20}
    >
      <ZoomOutScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.payoff.start}
      durationInFrames={SCENE_TIMING.payoff.duration}
      premountFor={20}
    >
      <PayoffScene />
    </Sequence>
    <Sequence
      from={SCENE_TIMING.loop.start}
      durationInFrames={SCENE_TIMING.loop.duration}
      premountFor={20}
    >
      <LoopScene />
    </Sequence>
  </AbsoluteFill>
);

/** Exact 18.5-second render target used for Phase 3 review. */
export const InternetAttentionPhase3 = InternetAttentionCollapse;
