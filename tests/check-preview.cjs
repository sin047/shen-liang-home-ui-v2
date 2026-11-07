"use strict";
// Provenance and DOM structure only. NOT a browser, Shader compiler or iPhone test.
const fs=require("node:fs");
const crypto=require("node:crypto");
const assert=require("node:assert/strict");
const read=path=>fs.readFileSync(path,"utf8");
const blob=x=>crypto.createHash("sha1").update("blob "+Buffer.byteLength(x)+"\0").update(x).digest("hex");
const engine=read("src/material/glass-material-kit-v05.js");
const core=read("src/material/glass-material-kit.css");
const viewport=read("src/material/glass-material-kit-v05.css");
const html=read("index.html");
const app=read("src/app.js");
const adapter=read("src/material/glass-adapter.js");
const styles=read("src/styles/legacy-layout.css");
assert.equal(blob(engine),"c75316d573aba6c8600bfa7c0549a5c1a58edb5b");
assert.equal(blob(core),"792f9f7855beb68d9e7ead0a99c41a9cfa564720");
assert.equal(blob(viewport),"081886de96cef0ff9c41fcfa93d22b030f337d4a");
assert.match(engine,/OES_standard_derivatives/);
assert.match(engine,/roundedDistance/);
assert.match(engine,/requestDiagnostics/);
assert.match(viewport,/background-repeat:no-repeat/);
assert.match(styles,/\.home-hero/);
assert.match(styles,/\.together-record/);
assert.match(styles,/\.reading-continue/);
assert.match(styles,/\.room-presence/);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,"Duplicate HTML IDs");
for(const name of [...app.matchAll(/\$\("([^"]+)"\)/g)].map(x=>x[1]))
  assert.ok(ids.includes(name),"Missing ID "+name);
for(const name of ["home","chat","together","reading","room","memory","settings"])
  assert.match(html,new RegExp('id="'+name+'Page"'));
const nav=html.slice(html.indexOf('<nav class="bottom-dock'),html.indexOf("</nav>",html.indexOf('<nav class="bottom-dock')));
assert.deepEqual([...nav.matchAll(/data-page="([^"]+)"/g)].map(x=>x[1]),["home","chat","together","reading","room"]);
assert.doesNotMatch(nav,/memory/i);
assert.match(html,/href="#room\/archive\/memory"/);
assert.match(html,/id="contentScroll"/);
assert.ok(html.includes('id="apiSettingsView"'));
assert.ok(html.includes('id="apiProfileForm"'));
assert.ok(html.includes('id="apiProtocol"'));
assert.ok(html.includes('id="apiKey"')&&html.includes('disabled aria-describedby="apiSecurityNote"'));
assert.ok(html.includes('href="#settings/api"'));
assert.ok(html.includes("./src/styles/settings-api.css"));
assert.match(app,/apiProfiles/);
assert.match(app,/公开预览不会发送网络请求/);
const settingsStyles=read("src/styles/settings-api.css");
assert.match(settingsStyles,/\.settings-page/);
assert.match(settingsStyles,/\.api-profile-card/);

assert.match(html,/id="wallpaper"/);
assert.match(html,/id="closeDiagnostics"/);
assert.match(html,/name="viewport"[^>]*viewport-fit=cover/);
assert.match(html,/apple-mobile-web-app-status-bar-style/);
assert.match(adapter,/GlassMaterialKit.mount/);
assert.match(adapter,/requestDiagnostics/);
assert.match(app,/visualViewport/);
assert.match(app,/replaceChildren/);
for(const forbidden of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/\bWebSocket\b/,/\bEventSource\b/,/\bsendBeacon\s*\(/,/\blocalStorage\b/,/\bsessionStorage\b/])
  assert.doesNotMatch(app,forbidden,"Public preview should not use network or private persistence");
assert.ok((html.match(/\sdata-glass(?=[\s>])/g)||[]).length>=10);
assert.ok(html.indexOf('id="wallpaper"')<html.indexOf('id="glass-scene"'));
assert.doesNotMatch(html,/<(?:script|img)\b[^>]*src=["']https?:/);

/* Explicit source-derived regression gates for Home/Chat v1 geometry.
   Structural proof only: not pixel-diff or a real WebKit screenshot. */
const layoutFidelity=read("src/styles/v1-home-chat-parity.css");
assert.doesNotMatch(html,/\bclass="home-continue\b/,"Old approved Home has no extra hero glass action");
assert.match(html,/class="thinking"/,"Long-chat thinking disclosure should be present");
assert.equal((html.slice(html.indexOf('<div class="chat" id="messages">'),html.indexOf('<div id="stressMessages">')).match(/<article class="message/g)||[]).length,4);
assert.match(layoutFidelity,/\.home-section-head h2\s*\{[^}]*font-size:\s*12px/);
assert.match(layoutFidelity,/\.home-tasks input\s*\{[^}]*width:\s*13px/);
assert.match(layoutFidelity,/\.chat\s*\{[^}]*max-width:\s*760px/);
assert.match(layoutFidelity,/\.chat\s*\{[^}]*padding:\s*20px 22px 26px/);
assert.match(html,/href="\.\/src\/styles\/v1-home-chat-parity\.css"/);
assert.ok(html.indexOf('id="stressToggle"')>html.indexOf('id="debugPanel"'),"Developer-only controls must not affect Chat layout");
console.log("PASS: unchanged Glass 0.5, safe five-page layout, route wiring and DOM-only interactions");
