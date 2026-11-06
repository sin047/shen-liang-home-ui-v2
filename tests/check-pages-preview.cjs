"use strict";
// Checks packaging / public safety markers. No browser, WebGL or deployment claim.
const fs=require("node:fs");
const assert=require("node:assert/strict");
const exists=p=>assert.ok(fs.existsSync(p),"Missing Pages asset "+p);
for(const path of ["index.html",".nojekyll","robots.txt","src/app.js","src/material/glass-material-kit-v05.js","src/material/glass-adapter.js","src/material/glass-material-kit-v05.css","src/material/glass-material-kit.css","src/styles/tokens.css","src/styles/shell.css","src/styles/legacy-layout.css"])exists(path);
const page=fs.readFileSync("index.html","utf8");
const scriptPaths=[...page.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(x=>x[1]);
const stylesheetPaths=[...page.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
assert.ok(scriptPaths.length>=3,"JavaScript source list is unexpectedly empty");
assert.ok(stylesheetPaths.length>=4,"CSS source list is unexpectedly empty");
for(const path of scriptPaths.concat(stylesheetPaths)){
  assert.match(path,/^\.\//,"Every static asset must use a Pages-safe relative path");
  exists(path);
}
assert.match(page,/name="robots" content="noindex,nofollow,noarchive"/);
assert.match(page,/id="wallpaper"/);
assert.match(page,/id="glass-scene"/);
assert.match(page,/href="#room\/archive\/memory"/);
assert.doesNotMatch(page,/(?:https?:)?\/\/[^\s"]+\.(?:js|css)/i,"No remote runtime assets");
assert.equal(fs.readFileSync(".nojekyll","utf8"),"");
console.log("PASS: static Pages root + relative assets + noindex + no Jekyll");
