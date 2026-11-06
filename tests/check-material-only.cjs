"use strict";
const fs=require("node:fs");
const crypto=require("node:crypto");
const assert=require("node:assert/strict");
const vm=require("node:vm");
const original=fs.readFileSync("legacy-original/chat-preview.html","utf8");
const upgraded=fs.readFileSync("material-only/chat-preview.html","utf8");
const css=fs.readFileSync("material-only/material-only.css","utf8");
const adapter=fs.readFileSync("material-only/material-only.js","utf8");
const blob=t=>crypto.createHash("sha1").update("blob "+Buffer.byteLength(t)+"\0").update(t).digest("hex");
const head='<link rel="stylesheet" href="../src/material/glass-material-kit-v05.css">\n<link rel="stylesheet" href="./material-only.css">\n';
const foot='<script src="../src/material/glass-material-kit-v05.js"></script>\n<script src="./material-only.js"></script>\n';
assert.equal(blob(original),"e4f246f24d94fdeafd207b7e60d03adda0b8f00c","Sanitized frozen V1 source changed");
assert.equal(upgraded.replace(head,"").replace(foot,""),original,
  "V1 HTML must be identical except four CSS/JS includes; do NOT rebuild UI");
assert.match(upgraded,/id="homePage"/);
assert.match(upgraded,/id="chatPage"/);
assert.match(upgraded,/id="togetherPage"/);
assert.match(upgraded,/id="readingPage"/);
assert.match(upgraded,/id="roomPage"/);
assert.match(upgraded,/id="memoryPage"/);
assert.match(upgraded,/class="dock"/);
const oldCss=upgraded.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert.ok(oldCss);
assert.equal(oldCss.length,49240);
assert.equal(blob(oldCss),"a7397c5cdade0e9e0cd50c3922438ff50dc157ef");
assert.match(adapter,/GlassMaterialKit/);
assert.match(adapter,/version!=="0.5.0"/);
assert.match(adapter,/markTargets\(/);
assert.match(adapter,/MutationObserver/);
assert.match(adapter,/getState/);
assert.doesNotMatch(adapter,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\b/);
assert.doesNotMatch(adapter,/\blocalStorage\b/);
assert.match(css,/\.glass-optical-ready/);
assert.match(css,/backdrop-filter:none!important/);
assert.match(css,/#app\.glass-kit-scene > \.glass-kit-canvas/);
assert.doesNotMatch(css,/#app\.glass-optical-ready[^{]*\{[^}]*\b(?:margin|padding|font-size|top|left|right|width|height)\s*:/s,
  "Only optical paint is allowed on V1 surfaces");
new vm.Script(adapter,{filename:"material-only.js"});
for(const url of ["../src/material/glass-material-kit-v05.css","../src/material/glass-material-kit-v05.js",
  "./material-only.css","./material-only.js"]){
 const relative=url.startsWith("../")?url.slice(3):"material-only/"+url.slice(2);
 assert.ok(fs.existsSync(relative),"Unresolved relative static asset: "+url);
}
assert.ok(fs.existsSync("material-only/manifest.webmanifest"));
for(const name of ["apple-touch-icon.png","favicon-32.png","icon-192.png","icon-512.png","icon-maskable-512.png"])
 assert.ok(fs.existsSync("material-only/assets/icons/"+name),"Missing frozen icon");
console.log("PASS: exact sanitized original V1 HTML/CSS/scripts + only optical adapter");
