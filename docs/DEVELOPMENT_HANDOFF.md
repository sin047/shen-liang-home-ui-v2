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


## 2026-11-07 — API connection manager modal on the material-only V1 baseline

- Base: `preview/ui-v2-iphone` at `066196c51e96330548502eaa4b6b644b71400388` (PR #6 merged to this preview branch; `main` remains `9c863faa6945a1774b205501ec3679dd0bb668bb`).
- Feature branch: `feat/api-connection-manager-modal`. The previous `feat/api-provider-settings` prototype is on the separate `fix/v1-home-chat-fidelity` line; it is not copied wholesale because that line has a different UI baseline and its key field is disabled/inline.
- Existing V1 Room → Settings → 模型与连接 route was present but its detail page was a placeholder. This change fills that existing route; no new Dock item, route family, or main-page layout is added.
- The connection editor is one reusable responsive dialog: centered desktop modal and iPhone bottom sheet with safe-area/VisualViewport sizing and a scrollable form. Supports multiple profiles, OpenAI-compatible / Anthropic Messages / custom protocol, Base URL, model ID, password API Key show/hide, enabled/default state, edit/delete, local simulated test states, and collapsed advanced request path/protocol/timeout/provider parameters.
- API Key and profile metadata are kept only in the current page's JS memory. The public preview sends no requests, uses no browser storage/URL/logging, clears key references on pagehide, and warns not to enter real keys. Test success means local field validation only, never a provider connection.
- Added a separate API stylesheet/script import and extended only the material-only target selector list so the new Settings surfaces can use Glass Kit 0.5. The original sanitized V1 HTML body, 49,240-character inline CSS, five Dock items, page structures, and Glass Kit engine source remain byte-identical.
- Validation: `node --check` for the new browser script; `tests/check-material-only.cjs` proves exact V1 baseline plus imports; `tests/check-api-connections.cjs` checks controls, no network/storage/logging, responsive/safe-area rules and unchanged engine SHA. GitHub Actions renders desktop/iPhone-size preview screenshots as a PR artifact only; no Pages deploy step is part of this feature.
- No merge, Pages deployment, real API request, backend/Canonical/Home repo change, or secret handling. Wait for owner visual and interaction acceptance.


## 2026-11-07 — PR #8 API manager verification snapshot

- Draft PR: [#8](https://github.com/sin047/shen-liang-home-ui-v2/pull/8), base `preview/ui-v2-iphone` at `066196c51e96330548502eaa4b6b644b71400388`. Implementation commit `219e75a9675ebd55d9bbbe79b6558ddaa689aaaf`; browser harness correction `7a1dc304a87cfa810ea5ecfec27ed82e7e9425d7`.
- Final PR-head checks: UI smoke `42376619855` **success**; browser preview `42376619974` **success**.
- Chromium interaction coverage passed: add/edit/delete, multiple protocols, default/enabled, key show/hide, key preservation without prefill, simulated loading/success/failure, cancel and key-field clearing.
- The screenshot browser reports the Glass Kit WebGL path as `gpu`. This is a headless Chromium result, **not** evidence of iPhone hardware-GPU or Safari acceptance.
- Screenshot artifact: [api-connection-ui-preview-8](https://github.com/sin047/shen-liang-home-ui-v2/actions/runs/42376619974/artifacts/13575494721), containing `api-connection-editor-desktop.png` (1440×1000 viewport) and `api-connection-editor-iphone.png` (390×844 viewport, DPR 3). Artifact retention is 14 days.
- The preview branch remains at `066196c51e96330548502eaa4b6b644b71400388`; `main` remains at `9c863faa6945a1774b205501ec3679dd0bb668bb`. The PR is still Draft. No merge, Pages deployment, provider request or official Home change has occurred.
- Remaining acceptance: inspect the two screenshots, then test the modal on actual iPhone Safari for keyboard overlap, scroll, safe areas, optical alignment and GPU fallback. Keep API credentials out of this public preview.
