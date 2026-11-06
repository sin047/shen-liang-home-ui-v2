# 家 ^ ^ · UI v2

Independent visual upgrade for **家 ^ ^**. The goal is to **preserve the approved original UI's overall page layouts and interaction rhythm**, while replacing selected CSS frosted surfaces with refractive **Glass Material Kit 0.5**.

This repository is **public**. It contains only frontend code and **synthetic demo content**—no private Canonical, raw chats, API keys or real account connections.

## Status

- [Draft PR #1](https://github.com/sin047/shen-liang-home-ui-v2/pull/1): byte-identical Glass Kit 0.5 import and Chat technical scaffold.
- Stacked branch feat/restore-home-v1-layout: selectively restores the approved **Home / Chat / Together / Reading / Room** structures, **Room → Archive → Memory**, and native UI interactions. **Not yet visually approved or device-verified.**
- Official baseline v1 remains protected in private sin047/shen-liang-home/apps/web/prototype/, untouched.

## Run

No build tools or external dependencies required. From repository root:

    python3 -m http.server 8080
    node tests/check-preview.cjs

Visit http://localhost:8080/#home or #chat. GitHub Pages hosting is **not yet enabled**.

Use **Chat → Aa → 打开 GPU 诊断与换背景** for material status, CLEAR/SMOKED comparison, wallpaper upload and diagnostics. A 40-message stress button is in Chat. Chat sends **only into the current DOM**, not to a backend. Sample titles and conversation text are invented.

Automated source checks are not actual GPU/iPhone tests; Safari scrolling, keyboard, standalone top status bar and energy remain unverified.

## Material provenance

Upstream sin047/shen-liang-home-ui-playground@afaf5a7c9ce64b7587dffba91d357ffe16176202. Three source files are byte-identical under src/material/ and checked by Git blob SHA. WebGL owns the optical surface only; native HTML owns text and interaction. Wallpaper is a fixed sibling outside the app scene.

## Documentation

- [V1 layout parity and gaps](docs/UI_V1_LAYOUT_PARITY.md)
- [V2 architecture](docs/UI_V2_ARCHITECTURE.md)
- [Glass integration](docs/GLASS_INTEGRATION.md)
- [Living handoff](docs/DEVELOPMENT_HANDOFF.md)

No pages are promoted into official Home; no branch is merged/deployed without owner authorization.
