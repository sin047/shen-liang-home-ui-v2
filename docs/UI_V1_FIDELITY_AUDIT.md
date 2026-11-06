# UI v1 fidelity audit — Home and Chat (2026-11-06)

## What was actually different

The first v2 layout port in PR #2 rebuilt the **shape** of Home but materially changed its exact geometry. This is why the new preview did not look 1:1 even though the page and tabs existed.

Verified source-level differences against frozen official v1 \`apps/web/prototype/chat-preview.html\` at \`2086756ad3e19e8fcf1b6147c6096a2e88e5a5cb\`:

| Area | Approved v1 | First v2 preview | This corrective branch |
| --- | --- | --- | --- |
| Home hero | clock and greeting with deliberate empty space | extra “继续聊天” glass card not present in v1 DOM | remove extra card |
| Home section label | Today 12px sans, letter-spacing 1px | 23px Georgia heading | restore v1 |
| Home checkbox | 13px circular custom | 17px native square | restore v1 |
| Home task row | 39px label rhythm | 49px bordered rows | restore v1 |
| Chat width | padded \`.chat\` max-width 760px, padding 20/22/26 | nested 750/700px area + separate page padding | restore content geometry |
| Chat sample density | four message groups; multi-bubble response, expandable details and long response | three shorter groups, no disclosure | synthetic four-group parity samples |
| Chat demo stress control | not part of ordinary old chat page | visible extra button below messages | move into dev diagnostics |
| Top header | 8px gaps and border-bottom | 7px gap, no border | restore geometry and boundary |
| Bottom Dock active treatment | subtle active pill | underline | revert to active pill |
| Glass material | CSS blur in v1; optical Kit 0.5 intended in v2 | CLEAR Shader | **preserved untouched** |

This branch is a deliberate **Home/Chat fidelity correction**, not a claim that every route is now a 1:1 recreation. Together, Reading, Room, Memory and PWA still need screenshot/DOM comparisons.

## Visual-change discipline

1. **First compare geometry** at the same viewport: top bar, safe-area, page margins, content order, cards, Dock, font scale, scrolling. Do not add a new surface or alter typography without approval.
2. Then compare visual treatments: glass refraction, reflection, density, color and border. Preserve CLEAR and use only isolated opt-in material overrides.
3. Collect screenshot pairs from old/new on iPhone Safari. Actual source CSS alone does not prove pixel equivalence.
4. Keep all original icons and personal text/assets in the private official repository; public v2 uses independently drawn or synthetic equivalents. Icon glyph differences remain a known fidelity gap.
5. No merge or Pages deployment from this correction branch without separate explicit approval; keep the existing public preview unchanged until reviewed.

## Validation

Checks under \`node tests/check-preview.cjs\` assert source provenance and key Home/Chat parity markers. GitHub Actions validates source syntax and structure. Browser rendering, iPhone viewport/keyboard and optical alignment require separate actual-device evidence.
