"use strict";
const fs=require("fs");
const path=require("path");
const root=__dirname;
const generator=fs.readFileSync(path.join(root,"generator.js"),"utf8");
const style=fs.readFileSync(path.join(root,"public","style.css"),"utf8");
const index=fs.readFileSync(path.join(root,"public","index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"public","app.js"),"utf8");
function ok(name,v){if(!v)throw new Error("FAIL: "+name);console.log("[ PASS ] "+name)}
ok("main footer single yellow",style.includes("Pass 12.25")&&style.includes("background:#ccff00!important")&&index.includes('class="cpb-footer-copy"')&&!index.includes('cpb-footer-center-zone'));
ok("generator footer single yellow",generator.includes('const html = `<div class="cpb-portal-footer-left"')&&!generator.includes('cpb-portal-footer-center'));
ok("generator footer compact",generator.includes('padding:10px 14px!important')&&generator.includes('width:34px!important;height:34px!important'));
ok("preview footer single yellow",app.includes("Pass 12.25 — preview canonical single-lime footer")&&!app.includes('<div class="preview-footer-center" aria-hidden="true"></div>'));
ok("animated double divider preserved",generator.includes("ctb-shared-footer-energy")&&generator.includes("energy-lime")&&generator.includes("energy-violet"));
