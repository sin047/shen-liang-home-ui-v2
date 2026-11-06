# 家 ^ ^ · UI v2

Independent next-generation interface development for the private companion space **家 ^ ^**. This public repo contains only **synthetic local UI preview data**; no private histories, secrets or Canonical.

**Status:** Draft structural Chat shell. Visual design is not approved; this is not the official product UI.

## Material

Uses the **byte-identical** `Glass Material Kit 0.5 · Viewport-fixed Wallpaper` engine from [the upstream optical playground](https://github.com/sin047/shen-liang-home-ui-playground/tree/afaf5a7c9ce64b7587dffba91d357ffe16176202). The material draws only glass; native DOM owns text, input and interactions. The app shell adapts the engine without changing its Shader.

## Run locally

From the repository root, use a static HTTP server, e.g. `python3 -m http.server 8080`, then open `http://localhost:8080/#chat`. No npm install or build is needed. The default background is synthesized in-browser. Use the **材质诊断** button to inspect GPU state, compare image, choose CLEAR/SMOKED or upload a local photo.

Check file provenance and basic structure using `node tests/check-preview.cjs`. These are not actual iPhone/GPU tests.

## Boundaries

- Keep Home / Chat / Together / Reading / Room; Memory stays inside Room.
- `sin047/shen-liang-home` retains the eight untouched v1 baseline files and its existing backend/private-chat routes. No automatic import.
- This preview never calls an LLM, server, or API, and does not store local input.
- No Pages deployment, manifest, Service Worker, or standalone acceptance in the initial Draft PR.

See [architecture](docs/UI_V2_ARCHITECTURE.md), [integration](docs/GLASS_INTEGRATION.md), and [handoff](docs/DEVELOPMENT_HANDOFF.md).
