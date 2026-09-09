# Internet Attention Collapse

`Internet Attention Collapse` is a production-ready Remotion project for a 50-second vertical YouTube Short about how long viral internet phenomena retain Google Search attention after reaching peak interest.

The central idea is deliberately nuanced:

> The internet is not running out of memes. It is running out of attention.

The film uses Google Trends as a relative, normalized signal. It does not claim that every meme dies faster every year, that memes have a universal half-life, or that Google Trends measures total cultural impact. The story shows that some viral search curves can compress from months into weeks while preserving persistent counterexamples.

## Production composition

The main composition is `InternetAttentionCollapse`:

- 1080 x 1920 vertical canvas
- 30 frames per second
- 1500 frames / 50 seconds
- deterministic Remotion rendering
- local Inter variable font; no font or data request is required at render time
- dark editorial data-storytelling visual language with neon trend curves, restrained glow, grid geometry, and mobile-safe typography

The full timeline contains:

1. a kinetic hook asking how long the internet cares;
2. Nyan Cat and Gangnam Style as persistent older examples;
3. Harlem Shake as the months-to-weeks fracture;
4. Ice Bucket Challenge, Mannequin Challenge, and Coffin Dance as fast examples and a counterexample;
5. Grimace Shake and an abstract trend/remix/saturate/replace cycle;
6. a qualitative 6-7 montage with no numeric attention-window claim;
7. a contextual zoom-out and the final attention payoff;
8. an intentional loop back into the opening question.

## Data and editorial boundaries

The viewer-facing metric is **Search Attention Window**: approximate time after peak Google Search interest until normalized interest falls to around half of peak.

The chart axis is **Normalized Google Search Interest**. Each trend is normalized relative to its own peak before curves are compared. Independent Google Trends scores are never treated as comparable absolute popularity measurements.

Quantitative hero examples are limited to evidence-supported observations:

| Example | Displayed window | Evidence resolution |
| --- | --- | --- |
| Nyan Cat (2011) | `~9 MONTHS` | Monthly Google Trends |
| Gangnam Style (2012) | `~4 MONTHS` | Monthly Google Trends |
| Harlem Shake (2013) | `~2-3 WEEKS` | Public week-level evidence |
| Ice Bucket Challenge (2014) | `<1 MONTH` | Monthly Google Trends |
| Mannequin Challenge (2016) | `~1-2 MONTHS` | Monthly Google Trends |
| Coffin Dance (2020) | `~4 MONTHS` | Monthly Google Trends; counterexample |
| Grimace Shake (2023) | `~1-2 MONTHS` | Monthly Google Trends |

The 6-7 sequence is qualitative only. It has no numeric attention-window value. The project does not use Ugandan Knuckles, Bernie's Mittens, Morbin Time, or Very Demure, Very Mindful as quantitative hero data, and it does not make a `140 days -> 2 days` claim.

Raw exports live under [`datasets/`](datasets/). Reviewed runtime summaries live in [`src/data/trendSummary.ts`](src/data/trendSummary.ts); presentation code does not fetch or parse raw CSV files during rendering.

## Architecture

```text
src/
  data/
    narration.json
    trendSummary.ts
  components/
    AttentionChart.tsx
    AttentionCycle.tsx
    Grid.tsx
    KineticText.tsx
    MetricReveal.tsx
    SourceCaption.tsx
    TrendCurve.tsx
    WeekZoomInset.tsx
  scenes/
    HookScene.tsx
    OldInternetScene.tsx
    HarlemFractureScene.tsx
    ExceptionsScene.tsx
    ModernCycleScene.tsx
    QualitativeMontageScene.tsx
    ZoomOutScene.tsx
    PayoffScene.tsx
    LoopScene.tsx
  lib/
    animation.ts
    audioCues.ts
    audioMix.ts
    chartMath.ts
    terminology.ts
    timing.ts
    typography.ts
  InternetAttentionCollapse.tsx
  AudioMaster.tsx
  Root.tsx
```

Chart math is isolated from React presentation. The reusable math layer handles peak detection, post-peak normalization, month/week mapping, spline paths, half-crossing intervals, and area paths. Timing beats and scene boundaries are centralized in `src/lib/timing.ts`.

The project also includes review compositions:

- `VisualPrototype` for visual-language testing
- `InternetAttentionPhase3` for the locked opening scenes
- `InternetAttentionLoopTest` for the visual loop seam
- `InternetAttentionFullMix` for voice, music, and sound design
- `InternetAttentionMusicSfx` for the narration-free mix
- `InternetAttentionAudiovisualLoopTest` for the audio/visual loop seam

## Audio

Audio is optional and modular. Voice, music, impacts, transitions, and texture are mixed independently in [`src/AudioMaster.tsx`](src/AudioMaster.tsx), with cue timing in [`src/lib/audioCues.ts`](src/lib/audioCues.ts) and level/ducking configuration in [`src/lib/audioMix.ts`](src/lib/audioMix.ts).

The video remains fully understandable without audio. The repository includes local generated stems and a temporary voice track for timing review. The music/SFX-only composition is available when a natural human or premium neural narration track is preferred.

## Development

Install dependencies and start Remotion Studio:

```powershell
npm.cmd install
npm.cmd run dev
```

Run the project checks:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run compositions
npm.cmd run validate
```

Render the main composition:

```powershell
npm.cmd run render
```

Useful review commands:

```powershell
npm.cmd run prototype
npm.cmd run phase3:render
npm.cmd run phase4:render
npm.cmd run phase5:render
npm.cmd run phase5:full
npm.cmd run audio:full
npm.cmd run audio:music-sfx
```

Generated previews and renders are written to `out/`, which is intentionally ignored by Git. Audio assets that are required for local rendering are kept under [`public/audio/`](public/audio/).

## Deterministic rendering

All motion is derived from Remotion's current frame and video configuration. The project does not use `Math.random()`, `setTimeout`, `requestAnimationFrame`, or render-time network requests. This keeps arbitrary-frame rendering, still generation, and repeat renders stable.

## License and source note

This repository is a custom production project. The source data is used as a reviewed editorial basis for relative Google Trends curve shapes; it should not be read as a claim about absolute search volume or total cultural relevance. Third-party names and examples remain references within the data story, not included brand assets.
