# Master brief: How Long Does the Internet Care?

This file is the repository-level editorial and implementation contract for the
50-second vertical Remotion Short. It should remain authoritative through all
implementation phases.

## Fixed composition

- ID: `InternetAttentionCollapse`
- 1080×1920, 30 fps, 1500 frames (50 seconds)
- React + TypeScript + Remotion
- Background `#09090b`; grid `#27272a`; local render-safe bold sans-serif
- Essential content stays approximately within x=80–1000 and y=180–1650.
- The final ~250 px and extreme top/right edges do not carry essential copy.

## Editorial contract

The payoff is: “The internet isn’t running out of memes. It’s running out of
attention.” The evidence supports the narrower observation that viral search
attention can compress from months into weeks while some memes break the
pattern. Never claim a decline from 140 days to 2 days, a year-by-year collapse,
absolute search volumes, total cultural impact, or total social-media attention.

Viewer-facing metric: **SEARCH ATTENTION WINDOW** — approximate time after peak
Google search interest until normalized interest falls to around half of peak.
The chart compares each curve’s post-peak shape after normalizing that trend to
its own peak. Attribution: `Source: Google Trends • normalized search interest`.

## Evidence allowed on screen

| Phenomenon | Year | Claim | Evidence role |
| --- | ---: | --- | --- |
| Nyan Cat | 2011 | ~9 months | monthly quantitative hero |
| Gangnam Style | 2012 | ~4 months | monthly quantitative hero / old internet anchor |
| Harlem Shake | 2013 | ~2–3 weeks | public week-level hero and dramatic fracture |
| Ice Bucket Challenge | 2014 | <1 month | monthly supporting example; never precise days |
| Mannequin Challenge | 2016 | ~1–2 months | monthly quantitative hero |
| Coffin Dance | 2020 | ~4 months | monthly counterexample |
| Grimace Shake | 2023 | ~1–2 months | monthly quantitative hero / modern anchor |
| 6-7 | 2025 | no numeric window | qualitative lifecycle only |

Do not use Ugandan Knuckles, Bernie’s Mittens, Morbin Time, or Very Demure,
Very Mindful as quantitative hero examples. Do not invent substitute values.

## Chart contract

- Main chart approximately 940–960 px wide and 800–900 px high around y=500–1380.
- X-axis: Months After Peak, 0–12 months.
- Y-axis: Normalized Google Search Interest, 0–100.
- Historical curves use roughly 0.12–0.28 opacity; the active curve receives full
  opacity, restrained neon glow, peak and 50% crossing emphasis.
- Do not compare 100 values across separately normalized datasets as if absolute.
- Do not show a fake perfect trend or crowd the frame with many labels.
- Harlem temporarily magnifies the first month into weeks, displays ~2–3 weeks,
  then collapses into the normal chart.

## Scene timing

| Frames | Scene | Required story beat |
| --- | --- | --- |
| 0–104 | Cold open | HOW LONG / DOES THE INTERNET / CARE?; grid materializes |
| 105–329 | Old internet | Nyan ~9 months; Gangnam ~4 months; attention lingered |
| 330–554 | Fracture | Harlem; week zoom; ~2–3 weeks; MONTHS → WEEKS |
| 555–809 | Exceptions | Ice Bucket, Mannequin, then Coffin Dance counterexample |
| 810–1109 | Modern cycle | Grimace; TREND / REMIX / SATURATE / REPLACE |
| 1110–1229 | 6-7 montage | VIRAL / EVERYWHERE / OVERUSED / NEXT; no number |
| 1230–1379 | Zoom out | imperfect pattern; defensible modern-cycle conclusion |
| 1380–1469 | Payoff | “running out of ATTENTION” on black |
| 1470–1499 | Loop | SO… transitions naturally back to opening question |

There should usually be one primary message, one supporting element, and one
visual focus. Add a meaningful comprehension-serving beat every 1–2.5 seconds;
avoid arbitrary constant motion. Typography targets: hook 80–120 px, statistics
120–220 px, secondary copy 42–60 px, and phrases of roughly 2–7 words.

All animation is deterministic and frame-derived with Remotion primitives. Never
use timeouts, animation frames, random values, or wall-clock state. Impact shake
must use a brief rise-and-decay envelope driven by `useCurrentFrame()`, not a
continuous sine. Arbitrary-frame rendering must be correct.

Audio is optional and the visual story must stand alone. Cue points cover hook
words, question impact, Nyan, Gangnam, Harlem spike and crossing, counterexample,
modern-cycle hits, ATTENTION, and loop. Missing assets must never break render.

## Mandatory phase gates

1. Foundation: project setup, registration, types/data, timing, chart math, static
   chart shell; typecheck, lint and composition discovery.
2. Static visual language: render and inspect frames around 60, 210, 430, 930,
   1420 before full animation.
3. Scenes 1–3: animate and inspect the prescribed early frames, then preview the
   first ~18 seconds in motion.
4. Scenes 4–6: implement exceptions, modern cycle and qualitative montage; inspect
   readability and evidence framing.
5. Payoff + loop: inspect frames 1380, 1420, 1460, 1480, 1490, 1499 and 0.
6. Full motion review: critically review all 50 seconds, then perform the final
   render and reliability checks.

Never advance past a gate solely because TypeScript compiles. Each later phase
requires its specified renders and visual inspection before the next begins.

