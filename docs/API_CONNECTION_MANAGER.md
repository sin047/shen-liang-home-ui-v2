# API 连接管理窗口 — material-only V1

## Entry point

Use the existing original Room → Settings → 模型与连接 route at `#room/settings/model`. The Room Settings overview already has this category, but its detail view was a placeholder. The API UI fills that placeholder without introducing a new Dock item or changing the five original pages.

## UI

- The API profile list supports multiple independent connections.
- The same editor is used for add and edit.
- Protocols: OpenAI-compatible, Anthropic Messages, and custom protocol/gateway.
- Fields: connection name, Base URL, API Key (password with show/hide), model ID, enabled/default switches.
- Advanced fields are collapsed initially: custom request path, custom protocol notes, timeout and supplier-specific parameters.
- Desktop: centered dialog. iPhone: bottom sheet with safe-area padding, VisualViewport-aware height/bottom offset, scrollable body, and 16px input text to avoid iOS focus zoom.
- Glass Kit 0.5 is reused for the dialog, default strip, list cards and add control. The upstream shader files are not changed.

## Public preview security boundary

This repository and its Pages preview are public. Never enter real API keys here.

- API key and connection profiles are held only in the current page's JavaScript memory.
- No localStorage, sessionStorage, IndexedDB, URL, console logging, or provider/network request is used.
- The API key input is cleared when the editor closes; in-memory key references are cleared on pagehide.
- Editing an existing profile leaves the key field blank; saving blank preserves the current in-memory key.
- "测试连接（模拟）" has loading, success and failure UI states but only validates local fields. A success message explicitly says no provider was contacted.
- A real implementation requires a private server adapter and server-side key storage. Provider-specific request paths, headers/versioning, timeouts and error handling must be implemented per protocol, not inferred from the Base URL.

## Verification

- `tests/check-material-only.cjs`: frozen sanitized V1 HTML and inline CSS identity; only explicit external style/script imports are added.
- `tests/check-api-connections.cjs`: controls, protocol coverage, no network/storage/logging, safe-area/viewport CSS and unchanged Glass Kit engine SHA.
- `tests/api-manager-browser-smoke.cjs`: browser interaction checks for add/edit/delete, multiple profiles, default/enabled, key reveal/mask, simulated test states and cancel; generates desktop and iPhone-size PNGs as a GitHub Actions artifact.
- The screenshot job is PR-only and uploads artifacts. It does not publish GitHub Pages.
- Actual iPhone Safari keyboard, scrolling, GPU refraction and visual parity remain owner-device acceptance items.
