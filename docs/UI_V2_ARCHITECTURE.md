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

## Owner-confirmed UI v2 direction (2026-11-06)

**UI v2 is an evolution of the original Home UI, not a redesigned product or a new page structure.** Keep the original layout and comfortable reading/interaction habits substantially intact; upgrade the glass appearance, component proportions, spacing and subtle depth. Owner confirmation applies to this *direction*, not to any particular color palette or final screenshot.

Use the original approved UI as **the layout/interaction reference**, not the minimal Chat shell in PR #1:

- Read-only authority: `sin047/shen-liang-home/apps/web/prototype/chat-preview.html` on official main `2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb`. Its Git blob SHA is `da85fc0981256428ed32e1459480660b918f3cc1`.
- Review its real Home, Chat, Together, Reading, Room, Memory-in-Room, header, composer, bottom Dock, dialogs, custom backgrounds, typography, `viewport-fit=cover`, standalone CSS, safe areas and VisualViewport/keyboard behavior before changing anything.
- Port the approved app-shell/page structure, native interaction logic and iOS/PWA protections **selectively** into versioned v2 components. Keep the frozen original untouched; do not wholesale paste its huge monolithic HTML/JS into the public repository.
- Because this repository is **Public**, audit all source text, image/icon assets, sample conversations and any browser storage before adding. Use synthetic neutral content and independent mock assets. No private Canonical, personal media, tokens, histories or authenticated API code.
- Preserve the approved layout first; then replace CSS-only frosted surfaces with the unchanged Glass Material Kit 0.5 through the adapter. Avoid adding extra CSS backdrops or fills that obscure CLEAR optical behavior.
- New preview's `src/` page structure must not silently lose old features. Document any incomplete port as an explicit parity gap; do not use the blank placeholder pages from PR #1 as the design target.
- Remain on a separate Draft PR, do not merge or enable Pages without authorization.

## Visual direction

Maintain the original Home layout and atmosphere; iterate on optical glass, shapes, component arrangement, spacing and subtle hierarchy. Exact per-component treatments await iterative owner screenshots and approval.
