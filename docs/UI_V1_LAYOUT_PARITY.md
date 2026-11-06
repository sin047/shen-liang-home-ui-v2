# V1 layout parity — selective port (2026-11-06)

## Authority and public safety

Frozen original (read-only): private sin047/shen-liang-home/apps/web/prototype/chat-preview.html on main 2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb, blob da85fc0981256428ed32e1459480660b918f3cc1. Eight baseline files and independent private-chat implementation untouched. Original icons/media and private conversations not copied.

This is a **selective reconstruction of structure and safe interactions**, not a wholesale public copy of the private monolithic preview.

## Parity and outstanding work

| Original | Public UI v2 now | Pending |
|---|---|---|
| Home date, clock, greeting, Today, recent, Room entry | Same spatial hierarchy, navigable links, local checklist and device time | Persistence and full Home search |
| Chat header, left/right messages, tools, composer | Native Chat header, avatar, messages, copy, local text/photo inputs and dialog entry points | Real conversations, content parts, Stream/Stop/Retry |
| Five-item bottom Dock | Home/Chat/Together/Reading/Room, order intact, native nav | Final active visual treatment |
| Together avatars, connection, vinyl, Listen/Play/Watch | Same key layout anchors, navigable detail routes | Activity sessions, full details, service adapters |
| Reading continue, library, article | Static synthetic reading titles and article route | Persisted documents/highlights/reading position |
| Room presence and Archive hierarchy | Presence, Archive, Memory, World and Prompt entries | Private document editing/import |
| Memory within Room | Filter/search affordances and clear empty state | Real memory data, note/pin/archive state |
| PWA and visual viewport | Standalone meta, safe-area styles, focused-foreground keyboard handling | Full baseline-equivalent standalone, icon/manifest, gray-strip and keyboard device acceptance |
| Optical material | Unchanged Kit 0.5, shared canvas and fixed wallpaper | Safari GPU output, momentum scroll, overlapping dialogs, long-session performance |

### Implementation boundaries

- Public repo: synthetic labels only, no private Canonical, conversations, icons or account data.
- Fixed wallpaper is outside the scene; viewport App Shell shares one WebGL1 canvas/texture. Native scroll remains inside the scene.
- Dialogs are CSS fallback **by design**, not a falsely claimed complex WebGL overlay.
- Old blur/veil/opacity controls are not blindly transferred because they could break background/GPU correspondence.
- Layout preserved in broad strokes, not pixel-identical. Owner must confirm screenshots and component treatments.

### iPhone checks still required

1. Compare original and v2 Home/Chat/Together/Reading/Room at same screen size.
2. Confirm GPU · fwidth AA, clear/refraction aligned with fixed wallpaper.
3. Scroll 40 extra Chat messages; slow + fast inertia, no repeating seam or black flashes.
4. Keyboard multiline focus/dismiss, foreground adjustment, Dock safe-area return.
5. Select photo, original compare, background rotation; test WebGL fallback and context restoration.
6. Standalone/PWA packaging only after separate approval; check top gray bar, icon and status bar.
7. Dialog overlays, reduced motion, screen reader and focus behavior.

**No claim of full behavioral parity or final visual/device acceptance.**
