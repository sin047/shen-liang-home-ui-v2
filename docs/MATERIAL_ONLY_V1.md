# V1 original UI + Glass Kit 0.5 — material-only preview

## Goal

Owner instruction: **only replace glass material, never redesign the original UI**. The public-safe original V1 HTML, its original 49,240-character CSS, original inline scripts, routes, native typography, visual space, DOM, icons, and interactions are left unchanged.

## Base and exactness proof

Original official source: private sin047/shen-liang-home/apps/web/prototype/chat-preview.html at 2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb.

Sanitized V1 mirror source: legacy-original/chat-preview.html, Git blob e4f246f24d94fdeafd207b7e60d03adda0b8f00c.

This material-only page: material-only/chat-preview.html. Only four CSS/JS include tags have been added. The CI test strips these four tags and compares the entire remainder byte-for-byte with the mirror. The original inline CSS blob stays a7397c5cdade0e9e0cd50c3922438ff50dc157ef.

## Glass effect

The unchanged upstream Glass Kit 0.5 shader is used as a shared optical canvas behind native V1 text. At runtime, existing .bubble, .composer, .dock, .home-continue, .room-note and .room-call a elements get data-glass attributes. Only their visual background, border color, shadow and CSS blur are replaced when WebGL reports success; their original geometry is left intact. Newly generated V1 message nodes are also tagged. If GPU is unsupported, original V1 CSS is still used.

The existing V1 wallpaper / veil / ambient light remain rendered, not replaced. Glass UV input approximates the original gradient and overlay, or uses the same custom uploaded image. **Inside-glass pixel correspondence is not guaranteed yet** under nondefault backgrounds; check actual iPhone screenshots before acceptance. No Shader changes.

## Privacy

This page shares the same privacy-safe substitutions as the already published old V1 reference: six private project-based Memory records replaced with fictional notes, and localStorage replaced by an in-memory Map. Public Pages is not private; do not enter personal messages or real secrets. All original V1 icons and manifest are copied bit-identically from the existing public-safe mirror.

## Links (after Pages deployment)

Original visual reference: https://sin047.github.io/shen-liang-home-ui-v2/legacy-original/chat-preview.html#home

Original layout + optical glass: https://sin047.github.io/shen-liang-home-ui-v2/material-only/chat-preview.html#home

Previous rewritten V2 (left unchanged): https://sin047.github.io/shen-liang-home-ui-v2/#home

To check GPU explicitly, append ?glassDebug=1 before the hash, e.g. /material-only/chat-preview.html?glassDebug=1#chat. The normal version shows no debug UI. These remain Safari previews, not verified iPhone/PWA acceptance.

## No reimplementation

Do not port the rewritten V2 layout into this folder. Do not change the original V1 inline CSS, DOM, or inline scripts to make the glass easier. Improve only the material-only adapter, its lens targets and optical alignment. No official Home repository, frozen files, private backend or main branch change.

## API connection manager extension (2026-11-07)

The existing Room → Settings → 模型与连接 detail route is now populated by a separate `api-connections.js` / `api-connections.css` layer. The original Room Settings route and placeholder are left in the frozen HTML; the extension fills the placeholder at runtime. The add/edit editor is a responsive modal and uses the same Glass Kit 0.5 optical material. The existing Glass Kit engine remains unchanged; only the material-only target selector list includes the new API surfaces.

See [API_CONNECTION_MANAGER.md](./API_CONNECTION_MANAGER.md) for UI controls, ephemeral-key handling, simulated test behavior, browser smoke checks and screenshot artifact details. This remains a public front-end prototype; do not enter real API keys and do not treat the simulated test as a provider connection.
