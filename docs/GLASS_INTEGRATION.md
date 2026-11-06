# Glass 0.5 integration — unchanged engine

- Upstream repository: https://github.com/sin047/shen-liang-home-ui-playground
- Pinned upstream main: `afaf5a7c9ce64b7587dffba91d357ffe16176202`
- Imported without edits: `docs/glass-material-kit-v05.js`, `docs/glass-material-kit.css`, `docs/glass-material-kit-v05.css`, copied under `src/material/`.
- Git blob identities are guarded by `tests/check-preview.cjs`.

## Layout contract

The wallpaper is an external fixed body sibling. `#glass-scene` is one viewport-sized app shell with a shared WebGL1 context/canvas. Header, scroll area, composer and dock are descendants of that shell. Only the center `#contentScroll` scrolls. The engine calculates each `data-glass` target by its actual screen rect during RAF and uses one single-cover background for GPU sampling.

No business text is rasterized into the WebGL canvas. App-owned elements remain native DOM and keyboard accessible. Material setup lives only in `src/material/glass-adapter.js`.

## Known boundaries

- The original Kit uses a bounded moving strip for long scenes; this preview holds the *scene* at viewport height instead. It must be tested on Safari with nested DOM scrolling.
- The original Kit's `MutationObserver` watches `style` and `class` changes inside the scene. Measure redraw cadence during movement; if internal canvas style mutations cause redundant RAFs, address narrowly, not by rewriting the Shader.
- Fallback and OES/fwidth paths are distinct. Fake WebGL/unit checks do not validate real GL compilation.
- No wallpaper filters or veil are applied in this preview: CSS source and uploaded GPU texture must represent the same pixels. Do not add CSS-only overlays inside the refractive material without testing UV agreement.
- Quick inertial scrolling, VisualViewport keyboard shifts, standalone gray strip, rotated layouts and overlapping dialogs remain device verification gates.
- This first branch deliberately includes no manifest, Service Worker or icons. Standalone PWA packaging must be separately reviewed against the preserved v1 baseline before test/rollout. Safari preview is not standalone acceptance.
