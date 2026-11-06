# Frozen UI v1 visual comparison (public-safe mirror)

## Purpose

This folder is a **faithful visual reference**, not the redesigned UI v2. Source of truth is the frozen private original file:

- Repo: sin047/shen-liang-home
- Main commit: 2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb
- Original source: apps/web/prototype/chat-preview.html (Git blob da85fc0981256428ed32e1459480660b918f3cc1)
- Stylesheet: **unchanged** inline CSS (Git blob a7397c5cdade0e9e0cd50c3922438ff50dc157ef).
- All 5 original app icons and the original manifest: byte-identical blobs.

## What was changed for safe public hosting

1. The six embedded Memory records referencing private project discussions were replaced with six completely fictional records using the same field structure. The archive/Memory DOM and CSS remain unchanged. **Private originals are not exposed.**
2. The legacy localStorage helper was replaced with an in-memory Map. The original interactions and UI structure remain, but content entered into the public comparison page is not persisted across reloads.
3. Only two nonvisual HTML meta tags were added: robots noindex/nofollow/noarchive and referrer no-referrer. Search engines are asked not to index this public preview; this does **not** make the URL private.

This is **not a byte-identical HTML copy**. It preserves the frozen DOM, components and complete 49,240-character inline stylesheet except the specific safety replacements noted above. It is intended for **visual/layout comparisons**, not as a private content archive or a fully validated offline PWA.

## Preview URLs

- Original visual reference: https://sin047.github.io/shen-liang-home-ui-v2/legacy-original/chat-preview.html#home
- Current Glass v2: https://sin047.github.io/shen-liang-home-ui-v2/#home
- Chat: change #home to #chat on both URLs.

The original V1 visual reference remains inside its own legacy-original directory. V2 root assets and PR #1/#2/#3 are untouched.

## Important limitations

- Public GitHub Pages has no login protection. Do **not** type private content or real credentials into either public preview.
- Memory text is synthetic; other preexisting sample chat and article text are part of the original design mock.
- The original standalone manifest is present for source fidelity, but keyboard, PWA install/standalone status bar and UI runtime still require iPhone validation.
- Source checks alone cannot prove pixel-perfect Safari output.
- The old V1 uses CSS-based frosted glass and a different background pipeline. Glass v2 uses the verified Kit 0.5 optical shader. **Do not overwrite either to make a misleading comparison.**
