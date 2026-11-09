# Home UI v1 — iPhone screenshot visual baseline (2026-11-06)

Status: **owner-provided partial visual reference**; not a complete screen inventory or approval of v2 styling.

This document records **layout and visual hierarchy**, not personal content. The 9 screenshots were supplied in a private conversation and **must not be committed to this public repository**. No private chat content, real memory, status-bar identifiers or private assets should be replicated. Compare against the read-only original `sin047/shen-liang-home/apps/web/prototype/chat-preview.html` on `2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb` and the published, privacy-sanitized mirror at `/legacy-original/chat-preview.html`.

## Non-negotiable approach

- **Layout-first, material-second:** inherit the original DOM/interaction hierarchy, not the structurally simplified V2 mock. Hold page geometry stable before selectively replacing frosted CSS surfaces with Glass Material Kit 0.5.
- V1 is a **quiet, mist-gray, editorial personal home** with generous negative space, fine line icons, restrained type and rounded white translucent controls. Do not redesign as a component-card dashboard.
- Glass Kit 0.5 optics are already liked: preserve its core Shader, fixed wallpaper and shared canvas, rather than replacing the original page design to accommodate lens surfaces.
- Keep bottom Dock `Home / Chat / Together / Reading / Room` and Memory beneath Room/Archive. Standard pages need careful top/bottom iPhone safe areas and fixed wallpaper during scroll.
- Use synthetic text/illustrations in the public repo. Screen content in the original images is not permission to publish its private words.

## Owner screenshot index and geometry locks

| Screenshot | V1 layout/features **visible** | V2 fidelity requirement |
|---|---|---|
| 1. Home | Airy date and two outline actions at top; very large lightweight clock + short greeting; **large intentional blank region** before compact `Today` section; small circular checkboxes; thin divider and linear recent history. Bottom pill Dock. | No new hero/CTA card in the negative space; Today is **small sans**, not a big serif section heading; preserve clock/section vertical rhythm and row proportions. |
| 2. Chat | Single header with back, **S** avatar, expressive Shin type, tiny online/presence line, phone and Aa. Messages alternate left/right **without per-message avatar/name**; separate slim metadata/copy; multiple adjacent assistant bubbles; collapsible `思考了一会儿`. Floating single input pill ABOVE independent icon+text Dock. | **Remove chat per-message bylines/avatars**, preserve original bubble sizes/gaps/reading measure and composer+Docks layering. Keep single top avatar, thinking disclosure and quiet metadata. |
| 3. Appearance | Centered rounded, off-white modal over blur; large heading, close round button; 2x2 background actions; vertical sliders for veil/blur/brightness/bubble opacity/text size. | Retain original entry, modal size and grouping. In V2 distinguish original CSS controls from optical-material controls; replace optically incompatible controls deliberately, not silently. |
| 4. Call | Entire calm page with small top-left back and `Call · 预览`, central handset, decorative Shin lettering, status/description, return-chat button; Room tab remains present. | **Route-like full page**, not a short centered alert modal. No actual call connects in preview. |
| 5. Conversations | Large **bottom sheet** with blurred backdrop, `Conversations`, add and close actions, conversation list and footnote. | Restore sheet presentation/placement, not a generic center dialog; use local synthetic records. |
| 6. Together | Large italic `Together` header; pair of circular L/S avatars linked by fine line; emphatic serif `Listen together`; huge central vinyl record; thin-rule `Enter` affordance and quiet-status text, next activities following below. | **Record is dominant focal element**, not a tiny decorative icon; preserve two-person spatial relation and page's vertical rhythm. |
| 7. Room (mid-scroll) | Large lightweight clock/date and greeting, then staggered text rows `Memories`, `Archive`, `Letters`, `Call`, hairline separators and broad margins. | Room must not become a flat three-item navigation card list. Preserve alternating/indented flow and multiple destinations. |
| 8. Room (top) | Italic `Room` label and `···` menu. Tall quiet hero with centered circular **S**, large expressive `Shin`, tiny presence status and `quiet evening`; clock and room links below. | Preserve **presence hero**, clock block and list sections together; allow native center-region scroll while Dock stays put. |
| 9. Settings | Full-page Settings route with top back/breadcrumb, title/subtitle, grouped linear rows with light rules: appearance/background, model/connections, voice/call, notifications, account/data. Bottom Dock still present. | Not merely a button that opens a generic appearance dialog. Restore route structure; inactive services remain nonfunctional previews. |

## Distinguish style and geometry

- **Geometry locks:** section order; horizontal margins; type hierarchy/line height; long vertical whitespace; scroll regions; top header, composer, Dock and bottom sheet positions; subtle active-tab pill; original icons.
- **Allowed material evolution:** lens refraction, border highlight, glass thickness, shine, translucency in **the same bounding boxes**, with native DOM text above the lens.
- **Do not infer:** precise pixel values from differently scaled screenshots; missing pages or hidden subroutes; real connected data, working voice, backend, persistence or standalone PWA success.

## Known V2 structural deviations to fix before visual polish

1. Current V2 Chat places a `Shin` byline/avatar inside the message stream; V1 screenshot does not. Remove and restore multi-bubble / thinking disclosure / metadata pattern.
2. V2 Together significantly compresses or rearranges vinyl and pair layouts. Restore original centerpieces and vertical hierarchy first.
3. V2 Room reduces the original presence/clock/Memory-Archive-Letters-Call spatial scene to a simplified menu. Restore page flow and routes.
4. V2 uses centered generic dialogs for Conversations and Call; V1 uses a bottom sheet and full Call page, respectively.
5. V2 Settings is not equivalent to original route; keep Settings and Appearance separate.
6. Original V1 `Home` is already published in `/legacy-original/`; use it for **direct same-device side-by-side** comparison with root V2 after every major change.

## Device validation

Compare V1 and V2 at same iPhone Safari viewport, same page/hash and similar scroll position. Take paired Home / Chat / Together / Room / Settings screenshots, then test keyboard, modals, GPU AA, scrolling, safe-area and fixed wallpaper. Passing Node smoke checks does not imply pixel-level 1:1 fidelity. Record an explicit per-screen owner visual acceptance before updating the public preview.

**Repository guardrails:** This note introduces no public screenshots, asset copying, private Canonical, real history, authenticated endpoints, Kit changes, Pages deployment or merges.
