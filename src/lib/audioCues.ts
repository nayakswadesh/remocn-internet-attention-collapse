import {BEAT_TIMING} from './timing';

export type AudioCueName =
  | 'hook-how-long'
  | 'hook-does-the-internet'
  | 'hook-care'
  | 'question-mark-impact'
  | 'nyan-reveal'
  | 'gangnam-reveal'
  | 'harlem-spike'
  | 'harlem-half-crossing'
  | 'ice-bucket-metric'
  | 'mannequin-metric'
  | 'coffin-extension'
  | 'counterexample-reveal'
  | 'modern-cycle-trend'
  | 'modern-cycle-remix'
  | 'modern-cycle-saturate'
  | 'modern-cycle-replace'
  | 'qualitative-viral'
  | 'qualitative-everywhere'
  | 'qualitative-overused'
  | 'qualitative-next'
  | 'qualitative-silence'
  | 'pattern-isnt-perfect'
  | 'weeks-conclusion'
  | 'payoff-premise'
  | 'attention-payoff'
  | 'loop';

export interface OptionalAudioCue {
  readonly name: AudioCueName;
  readonly frame: number;
  readonly asset?: string;
}

/**
 * Cue locations only. Assets remain optional so a missing sound can never make
 * the composition fail to bundle or render.
 */
export const AUDIO_CUES: readonly OptionalAudioCue[] = [
  {name: 'hook-how-long', frame: BEAT_TIMING.coldOpen.howLong},
  {
    name: 'hook-does-the-internet',
    frame: BEAT_TIMING.coldOpen.doesTheInternet,
  },
  {name: 'hook-care', frame: BEAT_TIMING.coldOpen.care},
  {name: 'question-mark-impact', frame: BEAT_TIMING.coldOpen.questionImpact},
  {name: 'nyan-reveal', frame: BEAT_TIMING.oldInternet.nyanReveal},
  {name: 'gangnam-reveal', frame: BEAT_TIMING.oldInternet.gangnamReveal},
  {name: 'harlem-spike', frame: BEAT_TIMING.fracture.harlemSpike},
  {name: 'harlem-half-crossing', frame: BEAT_TIMING.fracture.halfCrossing},
  {name: 'ice-bucket-metric', frame: BEAT_TIMING.exceptions.iceMetric},
  {name: 'mannequin-metric', frame: BEAT_TIMING.exceptions.mannequinMetric},
  {name: 'coffin-extension', frame: BEAT_TIMING.exceptions.coffinKeepsGoing},
  {
    name: 'counterexample-reveal',
    frame: BEAT_TIMING.exceptions.counterexampleReveal,
  },
  {name: 'modern-cycle-trend', frame: BEAT_TIMING.modernCycle.trend},
  {name: 'modern-cycle-remix', frame: BEAT_TIMING.modernCycle.remix},
  {name: 'modern-cycle-saturate', frame: BEAT_TIMING.modernCycle.saturate},
  {name: 'modern-cycle-replace', frame: BEAT_TIMING.modernCycle.replace},
  {name: 'qualitative-viral', frame: BEAT_TIMING.qualitativeMontage.viral},
  {
    name: 'qualitative-everywhere',
    frame: BEAT_TIMING.qualitativeMontage.everywhere,
  },
  {
    name: 'qualitative-overused',
    frame: BEAT_TIMING.qualitativeMontage.overused,
  },
  {name: 'qualitative-next', frame: BEAT_TIMING.qualitativeMontage.next},
  {name: 'qualitative-silence', frame: BEAT_TIMING.qualitativeMontage.silence},
  {name: 'pattern-isnt-perfect', frame: BEAT_TIMING.zoomOut.patternSecond},
  {name: 'weeks-conclusion', frame: BEAT_TIMING.zoomOut.conclusionFinal},
  {name: 'payoff-premise', frame: BEAT_TIMING.payoff.memes},
  {name: 'attention-payoff', frame: BEAT_TIMING.payoff.attention},
  {name: 'loop', frame: BEAT_TIMING.loop.returnToHook},
] as const;

export const enabledAudioCues = AUDIO_CUES.filter(
  (cue): cue is OptionalAudioCue & {readonly asset: string} =>
    typeof cue.asset === 'string',
);
