import {Composition} from 'remotion';
import {
  InternetAttentionAudiovisualLoopTest,
  InternetAttentionFullMix,
  InternetAttentionMusicSfx,
} from './AudioMaster';
import {
  InternetAttentionCollapse,
  InternetAttentionPhase3,
} from './InternetAttentionCollapse';
import {SCENE_TIMING, VIDEO_CONFIG} from './lib/timing';
import {InternetAttentionLoopTest, LOOP_TEST_DURATION} from './LoopTest';
import {VisualPrototype, VISUAL_PROTOTYPE_DURATION} from './VisualPrototype';

export const RemotionRoot = () => (
  <>
    <Composition
      id={VIDEO_CONFIG.id}
      component={InternetAttentionCollapse}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="InternetAttentionPhase3"
      component={InternetAttentionPhase3}
      durationInFrames={SCENE_TIMING.fracture.endExclusive}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="VisualPrototype"
      component={VisualPrototype}
      durationInFrames={VISUAL_PROTOTYPE_DURATION}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="InternetAttentionLoopTest"
      component={InternetAttentionLoopTest}
      durationInFrames={LOOP_TEST_DURATION}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="InternetAttentionFullMix"
      component={InternetAttentionFullMix}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="InternetAttentionMusicSfx"
      component={InternetAttentionMusicSfx}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
    <Composition
      id="InternetAttentionAudiovisualLoopTest"
      component={InternetAttentionAudiovisualLoopTest}
      durationInFrames={LOOP_TEST_DURATION}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
  </>
);
