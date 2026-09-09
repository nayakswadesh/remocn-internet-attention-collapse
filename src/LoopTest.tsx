import {AbsoluteFill, Sequence} from 'remotion';
import {InternetAttentionCollapse} from './InternetAttentionCollapse';

export const LOOP_TEST_TAIL_START = 1420;
export const LOOP_TEST_TAIL_DURATION = 80;
export const LOOP_TEST_HEAD_DURATION = 120;
export const LOOP_TEST_DURATION = LOOP_TEST_TAIL_DURATION + LOOP_TEST_HEAD_DURATION;

export const InternetAttentionLoopTest = () => (
  <AbsoluteFill style={{background: '#09090b'}}>
    <Sequence durationInFrames={LOOP_TEST_TAIL_DURATION}>
      <Sequence from={-LOOP_TEST_TAIL_START}>
        <InternetAttentionCollapse />
      </Sequence>
    </Sequence>
    <Sequence from={LOOP_TEST_TAIL_DURATION} durationInFrames={LOOP_TEST_HEAD_DURATION}>
      <InternetAttentionCollapse />
    </Sequence>
  </AbsoluteFill>
);
