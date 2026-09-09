import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {InternetAttentionCollapse} from './InternetAttentionCollapse';
import {InternetAttentionLoopTest, LOOP_TEST_HEAD_DURATION, LOOP_TEST_TAIL_DURATION, LOOP_TEST_TAIL_START} from './LoopTest';
import {AUDIO_ASSETS, AUDIO_LEVELS, musicLevelAtFrame} from './lib/audioMix';

interface AudioLayersProps {
  readonly includeVoice: boolean;
  readonly sourceFrameOffset?: number;
  readonly trimBefore?: number;
}

const AudioLayers = ({includeVoice, sourceFrameOffset = 0, trimBefore = 0}: AudioLayersProps) => {
  const frame = useCurrentFrame();
  const sourceFrame = frame + sourceFrameOffset;

  return (
    <>
      {includeVoice ? (
        <Audio
          name="VOICE"
          src={staticFile(AUDIO_ASSETS.voice)}
          trimBefore={trimBefore}
          volume={() => AUDIO_LEVELS.voice}
        />
      ) : null}
      <Audio
        name="MUSIC"
        src={staticFile(AUDIO_ASSETS.music)}
        trimBefore={trimBefore}
        volume={() => musicLevelAtFrame(sourceFrame, includeVoice)}
      />
      <Audio
        name="IMPACTS"
        src={staticFile(AUDIO_ASSETS.impacts)}
        trimBefore={trimBefore}
        volume={() => AUDIO_LEVELS.impacts}
      />
      <Audio
        name="TRANSITIONS"
        src={staticFile(AUDIO_ASSETS.transitions)}
        trimBefore={trimBefore}
        volume={() => AUDIO_LEVELS.transitions}
      />
      <Audio
        name="TEXTURE / AMBIENCE"
        src={staticFile(AUDIO_ASSETS.texture)}
        trimBefore={trimBefore}
        volume={() => AUDIO_LEVELS.texture}
      />
    </>
  );
};

export const InternetAttentionFullMix = () => (
  <AbsoluteFill>
    <InternetAttentionCollapse />
    <AudioLayers includeVoice />
  </AbsoluteFill>
);

export const InternetAttentionMusicSfx = () => (
  <AbsoluteFill>
    <InternetAttentionCollapse />
    <AudioLayers includeVoice={false} />
  </AbsoluteFill>
);

export const InternetAttentionAudiovisualLoopTest = () => (
  <AbsoluteFill>
    <InternetAttentionLoopTest />
    <Sequence durationInFrames={LOOP_TEST_TAIL_DURATION}>
      <AudioLayers
        includeVoice
        sourceFrameOffset={LOOP_TEST_TAIL_START}
        trimBefore={LOOP_TEST_TAIL_START}
      />
    </Sequence>
    <Sequence from={LOOP_TEST_TAIL_DURATION} durationInFrames={LOOP_TEST_HEAD_DURATION}>
      <AudioLayers includeVoice />
    </Sequence>
  </AbsoluteFill>
);
