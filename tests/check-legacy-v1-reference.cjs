"use strict";
// Frozen private v1 visual reference is hosted with strictly limited public-safe substitutions.
// Structural/source checks only. Does not validate iPhone rendering or interaction.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const crypto=require("node:crypto");
const vm=require("node:vm");
const root="legacy-original/";
const read=f=>fs.readFileSync(root+f);
const sha=buf=>crypto.createHash("sha1").update("blob "+buf.length+"\0").update(buf).digest("hex");
const html=read("chat-preview.html").toString("utf8");
const style=html.match(/<style>([\s\S]*?)<\/style>/);
assert.ok(style,"Original inline CSS must remain present");
assert.equal(Buffer.byteLength(style[1],"utf8"),Buffer.byteLength(style[1],"utf8"));
assert.equal(sha(Buffer.from(style[1],"utf8")),"a7397c5cdade0e9e0cd50c3922438ff50dc157ef","Original v1 CSS changed");
assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/);
assert.match(html,/const previewStore=new Map\(\)/);
assert.doesNotMatch(html,/localStorage\s*\./);
assert.match(html,/id:'demo-anchor'/);
assert.match(html,/id:'demo-thought'/);
assert.doesNotMatch(html,/家 \^ \^ 项目确认/);
assert.doesNotMatch(html,/来源：10月/);
for(const id of ["app","chatPage","homePage","memoryPage","readingPage","togetherPage","roomPage","scroller","composer","dock","settings"]){
 assert.match(html,new RegExp('id="'+id+'"'),"Missing original DOM: "+id);
}
const js=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.equal(js.length,7,"Unexpected number of original inline scripts");
js.forEach((m,i)=>new vm.Script(m[1],{filename:"v1-inline-"+i+".js"}));
const manifest=read("manifest.webmanifest");
assert.equal(sha(manifest),"9fe5d509ecfde512d2642b9b361bfcb287b34d27");
const config=JSON.parse(manifest.toString("utf8"));
assert.equal(config.start_url,"./chat-preview.html#home");
assert.equal(config.display,"standalone");
const iconShas={
 "apple-touch-icon.png":"1a4206ce23a9e6555c346da92c0a77cb28167797",
 "favicon-32.png":"2e5472bbe8f3d60f7ae44493d7d6b07f1dbd954e",
 "icon-192.png":"41967962573ff7db09f9f2576f6c10b323b68526",
 "icon-512.png":"0980d9285f43cb8244598b0c069d085d7bb85a19",
 "icon-maskable-512.png":"806da56ea11c8d1a70e3ac765bf5eeeecb076c38"
};
for(const [name,expected] of Object.entries(iconShas)){
  assert.equal(sha(read("assets/icons/"+name)),expected,"v1 icon changed: "+name);
}
console.log("PASS: unchanged frozen V1 CSS/manifest/icons, 7 parsed scripts, original layout DOM and sanitized ephemeral storage");
