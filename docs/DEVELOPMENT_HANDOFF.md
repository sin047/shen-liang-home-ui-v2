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
- Next: user-supplied visual references; Safari scroll/keyboard/fallback/GL verification; visual and component work in successive reviewed PRs.
