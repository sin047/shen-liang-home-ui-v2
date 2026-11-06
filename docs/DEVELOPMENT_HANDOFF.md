# UI v2 living handoff

## 2026-11-06 — first independent branch

- Repo: `sin047/shen-liang-home-ui-v2` (public; synthetic-only).
- Starting `main`: `9c863faa6945a1774b205501ec3679dd0bb668bb`.
- Branch: `feat/glass-v05-chat-shell`.
- Source: `sin047/shen-liang-home-ui-playground` pinned `afaf5a7c9ce64b7587dffba91d357ffe16176202`; `src/material` imports unmodified and guarded by Git blob SHA.
- Goal: isolate an interactive structural Chat shell, *not* user-approved visual design.
- Never change Home's eight frozen UI-baseline files, its private-chat adapter, databases, Canonical, authentication, or Provider.
- Run `node tests/check-preview.cjs` and `node --check` for all shipped JS. Actual WebGL+iPhone/PWA tests are pending.
- Do not merge, deploy Pages, or connect a real backend/model without the user's explicit authorization.
- Next: restore the approved original UI's layout and interaction parity using safe selective porting; Safari scroll/keyboard/fallback/GL verification; iterative component-by-component visual upgrades.

## 2026-11-06 — UI direction clarified by owner

- **Keep the approved original UI layout broadly unchanged.** Update CLEAR optical material and individual component size/shape/spacing/layers rather than redesigning the app.
- The first Draft PR's simplified Chat shell is only a technical smoke scaffold, **not** the visual/layout reference.
- Authoritative frozen read-only source: `sin047/shen-liang-home/apps/web/prototype/chat-preview.html` (blob `da85fc0981256428ed32e1459480660b918f3cc1`); its eight frozen files and existing internal private-chat implementation remain untouched.
- Original PWA/safe-area/VisualViewport input handling should be re-used selectively and independently validated on iPhone.
- New v2 repo is Public: do not bulk publish private-repo files, user icons/assets, personal examples or any actual data. Selective, audited layout/components with synthetic content only.
- At this step this entry records a **design/implementation decision**, not completion of the old UI port; no production/API/Pages deployment is authorized.
