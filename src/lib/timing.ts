export const VIDEO_CONFIG = {
  id: 'InternetAttentionCollapse',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1500,
} as const;

export interface SceneTiming {
  readonly start: number;
  readonly duration: number;
  readonly endExclusive: number;
}

const scene = (start: number, endExclusive: number): SceneTiming => ({
  start,
  duration: endExclusive - start,
  endExclusive,
});

export const SCENE_TIMING = {
  coldOpen: scene(0, 105),
  oldInternet: scene(105, 330),
  fracture: scene(330, 555),
  exceptions: scene(555, 810),
  modernCycle: scene(810, 1110),
  qualitativeMontage: scene(1110, 1230),
  zoomOut: scene(1230, 1380),
  payoff: scene(1380, 1470),
  loop: scene(1470, 1500),
} as const satisfies Record<string, SceneTiming>;

const atSceneFrame = (sceneTiming: SceneTiming, localFrame: number): number =>
  sceneTiming.start + localFrame;

/**
 * Named narrative beats shared by future scene visuals and optional audio cues.
 * Keeping them here prevents scene components from duplicating frame literals.
 */
export const BEAT_TIMING = {
  coldOpen: {
    howLong: 2,
    doesTheInternet: 18,
    care: 40,
    questionImpact: 55,
    timelinePull: 82,
  },
  oldInternet: {
    year2011: atSceneFrame(SCENE_TIMING.oldInternet, 0),
    nyanReveal: atSceneFrame(SCENE_TIMING.oldInternet, 18),
    nyanMetric: atSceneFrame(SCENE_TIMING.oldInternet, 38),
    nyanChart: atSceneFrame(SCENE_TIMING.oldInternet, 48),
    year2012: atSceneFrame(SCENE_TIMING.oldInternet, 78),
    gangnamReveal: atSceneFrame(SCENE_TIMING.oldInternet, 98),
    gangnamMetric: atSceneFrame(SCENE_TIMING.oldInternet, 118),
    lingerStatement: atSceneFrame(SCENE_TIMING.oldInternet, 168),
    exit: atSceneFrame(SCENE_TIMING.oldInternet, 210),
  },
  fracture: {
    patternInterrupt: atSceneFrame(SCENE_TIMING.fracture, 0),
    year2013: atSceneFrame(SCENE_TIMING.fracture, 32),
    harlemSpike: atSceneFrame(SCENE_TIMING.fracture, 50),
    timelineCompress: atSceneFrame(SCENE_TIMING.fracture, 76),
    weekMagnify: atSceneFrame(SCENE_TIMING.fracture, 112),
    metricReveal: atSceneFrame(SCENE_TIMING.fracture, 140),
    halfCrossing: atSceneFrame(SCENE_TIMING.fracture, 150),
    pause: atSceneFrame(SCENE_TIMING.fracture, 175),
  },
  exceptions: {
    iceYear: atSceneFrame(SCENE_TIMING.exceptions, 0),
    iceSubject: atSceneFrame(SCENE_TIMING.exceptions, 6),
    iceCurve: atSceneFrame(SCENE_TIMING.exceptions, 14),
    iceMetric: atSceneFrame(SCENE_TIMING.exceptions, 26),
    mannequinYear: atSceneFrame(SCENE_TIMING.exceptions, 52),
    mannequinSubject: atSceneFrame(SCENE_TIMING.exceptions, 59),
    mannequinCurve: atSceneFrame(SCENE_TIMING.exceptions, 67),
    mannequinMetric: atSceneFrame(SCENE_TIMING.exceptions, 79),
    coffinYear: atSceneFrame(SCENE_TIMING.exceptions, 105),
    coffinSubject: atSceneFrame(SCENE_TIMING.exceptions, 116),
    coffinCurve: atSceneFrame(SCENE_TIMING.exceptions, 124),
    coffinKeepsGoing: atSceneFrame(SCENE_TIMING.exceptions, 152),
    counterexampleReveal: atSceneFrame(SCENE_TIMING.exceptions, 182),
    coffinMetric: atSceneFrame(SCENE_TIMING.exceptions, 197),
    counterStatement: atSceneFrame(SCENE_TIMING.exceptions, 210),
    exit: atSceneFrame(SCENE_TIMING.exceptions, 240),
  },
  modernCycle: {
    transitionCopy: atSceneFrame(SCENE_TIMING.modernCycle, 0),
    year2023: atSceneFrame(SCENE_TIMING.modernCycle, 22),
    grimaceSubject: atSceneFrame(SCENE_TIMING.modernCycle, 35),
    grimaceMetric: atSceneFrame(SCENE_TIMING.modernCycle, 50),
    grimaceCurve: atSceneFrame(SCENE_TIMING.modernCycle, 58),
    trend: atSceneFrame(SCENE_TIMING.modernCycle, 104),
    remix: atSceneFrame(SCENE_TIMING.modernCycle, 140),
    saturate: atSceneFrame(SCENE_TIMING.modernCycle, 176),
    replace: atSceneFrame(SCENE_TIMING.modernCycle, 212),
    aftermath: atSceneFrame(SCENE_TIMING.modernCycle, 248),
    exit: atSceneFrame(SCENE_TIMING.modernCycle, 278),
  },
  qualitativeMontage: {
    viral: atSceneFrame(SCENE_TIMING.qualitativeMontage, 0),
    everywhere: atSceneFrame(SCENE_TIMING.qualitativeMontage, 26),
    overused: atSceneFrame(SCENE_TIMING.qualitativeMontage, 54),
    next: atSceneFrame(SCENE_TIMING.qualitativeMontage, 84),
    silence: atSceneFrame(SCENE_TIMING.qualitativeMontage, 108),
  },
  zoomOut: {
    breathe: atSceneFrame(SCENE_TIMING.zoomOut, 8),
    patternFirst: atSceneFrame(SCENE_TIMING.zoomOut, 14),
    patternSecond: atSceneFrame(SCENE_TIMING.zoomOut, 23),
    evidence: atSceneFrame(SCENE_TIMING.zoomOut, 36),
    longTails: atSceneFrame(SCENE_TIMING.zoomOut, 44),
    volatileCycles: atSceneFrame(SCENE_TIMING.zoomOut, 57),
    fastWindows: atSceneFrame(SCENE_TIMING.zoomOut, 70),
    conclusion: atSceneFrame(SCENE_TIMING.zoomOut, 100),
    conclusionSecond: atSceneFrame(SCENE_TIMING.zoomOut, 110),
    conclusionFinal: atSceneFrame(SCENE_TIMING.zoomOut, 120),
    exit: atSceneFrame(SCENE_TIMING.zoomOut, 142),
  },
  payoff: {
    premise: atSceneFrame(SCENE_TIMING.payoff, 0),
    memes: atSceneFrame(SCENE_TIMING.payoff, 8),
    finalLead: atSceneFrame(SCENE_TIMING.payoff, 35),
    attention: atSceneFrame(SCENE_TIMING.payoff, 52),
  },
  loop: {
    bridge: atSceneFrame(SCENE_TIMING.loop, 5),
    returnToHook: atSceneFrame(SCENE_TIMING.loop, 21),
  },
} as const;

/** Shared primitive durations. Narrative beat timing remains centralized per scene. */
export const MOTION_TIMING = {
  kineticTextEntrance: 22,
  metricReveal: 24,
  impactEnvelope: 12,
} as const;

export const secondsToFrames = (seconds: number): number =>
  Math.round(seconds * VIDEO_CONFIG.fps);

export const framesToSeconds = (frames: number): number =>
  frames / VIDEO_CONFIG.fps;
