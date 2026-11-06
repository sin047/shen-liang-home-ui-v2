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


## 2026-11-06 — v1 layout reconstruction in stacked branch

- feat/restore-home-v1-layout branches from PR #1 head e8569a16bb78bcc4b09563d09b15d438e8b3806b.
- Replaces blank/generic scaffold with five original page layouts (Home clock/Today/recent; Chat header and composer; Together avatars/record/Listen-Play-Watch; Reading continue/articles; Room presence/Archive plus Memory/World/Prompt).
- Native dialog/route/checkbox/local Chat input and image/temporary avatar/copy/search/font controls. No fetch, real storage, API, auth, external asset or private history.
- Kit 0.5 optical files unchanged. CSS layout independent from material adapter.
- Layout is a structural parity step, **not final visual approval or Safari test**; read docs/UI_V1_LAYOUT_PARITY.md for the known missing original features.
- No merge, GitHub Pages deployment or original Home repo modification.
