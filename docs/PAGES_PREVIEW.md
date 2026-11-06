# iPhone Safari preview — GitHub Pages setup

This branch is a **nonproduction preview** made from the layout-port Draft PR #2. It does not modify or merge either Draft PR, does not touch the original Home repository, and contains no real private content.

## Publishing source (manual owner step)

In the GitHub repository **Settings → Pages → Build and deployment**, set:

- **Source:** Deploy from a branch
- **Branch:** preview/ui-v2-iphone
- **Folder:** /(root)
- Click **Save**.

GitHub Pages automatically publishes the selected branch's root files when enabled. This repo initially had **no Pages site**. A branch being present is **not proof of deployment**. Check the Pages settings or the Pages build/deploy Actions for completion before treating an address as live.

Expected URL **only after successful deployment**:

https://sin047.github.io/shen-liang-home-ui-v2/#home

For Chat, use #chat at that URL.

There is no Vite or npm build; the app is static and uses only relative local CSS/JS. The root has .nojekyll. Page requests must serve src/material/, src/styles/ and src/app.js. GitHub Pages will be publicly accessible.

## Acceptance order

1. In iPhone Safari, open the generated Pages URL (not github.com source view). Confirm Home and five-item dock.
2. Navigate to Chat → tap Aa → 打开 GPU 诊断与换背景. Confirm **GPU · fwidth AA** or record the precise fallback; CSS fallback is **not** accepted as GPU.
3. Test CLEAR optical refraction (and original compare), wallpaper photo chooser, 40 extra messages, slow/fast scrolling, native font clarity.
4. Tap the composer, open/dismiss keyboard, type multiline, send synthetic local text and ensure Dock returns and safe areas do not overlap.
5. Visit Together, Reading, Room and Archive → Memory. Missing backend features are intentionally described in docs/UI_V1_LAYOUT_PARITY.md.
6. This branch has **no manifest or Service Worker** and is **not yet standalone PWA acceptance**. Add-to-Home-Screen/fullscreen/status-bar issues must not be considered resolved merely by Safari tests.

## Privacy and lifecycle

- GitHub Pages is public, just like the repository. This preview has **no account gate**.
- No real Canonical, personal photos, saved notes, API keys, provider tokens or private-chat data are shipped.
- Uploaded photo/temporary avatar use browser object URLs; local chat text remains in this page's DOM only and is lost on reload.
- Do **not** put personal test data in GitHub commits or GitHub Issues, PR comments, screenshots or screenshots hosted publicly.
- Only approved UI checks run on preview pushes. No automated Pages deployment workflow is added: the owner chooses the Pages source in Settings and can later disable it or change the branch.
- Changes in Draft PR #2 do not automatically update the preview branch. The preview branch must be intentionally synchronized and retested when accepted changes are ready.
