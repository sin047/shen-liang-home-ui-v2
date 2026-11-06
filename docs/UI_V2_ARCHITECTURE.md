# Home UI v2 — architecture preview (not visual approval)

## Intent

A private, calm, long-term companion home. Keep Home / Chat / Together / Reading / Room in this order. Memory belongs inside Room. The original home-ui baseline and the isolated private-chat adapter remain protected and untouched in `sin047/shen-liang-home`.

This public repository holds **only** reusable visual components and synthetic sample text. No actual Canonical, histories, secrets, model/provider calls or private media.

## Decision log

- v2 is developed independently from the official Home repository; promotion to Home requires a separate reviewed integration.
- Keep upstream Glass Material Kit 0.5 exactly; app adapters manage layout/mounting and UI surfaces.
- No React/Vue/build step unless a demonstrated need appears. GitHub Pages can later serve static HTML with relative assets, **only after explicit approval to deploy**.
- The first branch is a working Chat *structural* preview. Colors, spacing, type and layout remain provisional until user reference/approval.
- The top bar, scroll region, composer and five-item dock form a single viewport-sized glass scene. Long content scrolls inside a native region.

## Components in first preview

- `data-glass` top bar / dock (control)
- chat bubbles (compact/control)
- information card (panel)
- send button (compact) and textarea container (control)
- diagnostics with GPU/fallback status, compare and photo input
- 40-message synthetic scroll stress and local-only message entry
- navigable placeholder destinations for four other protected Dock locations

## Acceptance split

The **upstream** Kit 0.5 succeeded in user iPhone Safari screenshots (fwidth AA, fixed wallpaper, 49 target diagnostics, clear material preference). This **new app shell** has not been tested on an iPhone or in a standalone PWA. Passing source checks demonstrates neither GPU performance nor visual fidelity.

## Visual direction

Pending user references. Do not treat this neutral shell as approved final design.
