"use strict";
const fs=require("fs");
const path=require("path");
const base=__dirname;
const html=fs.readFileSync(path.join(base,"public","index.html"),"utf8");
const css=fs.readFileSync(path.join(base,"public","style.css"),"utf8");
const app=fs.readFileSync(path.join(base,"public","app.js"),"utf8");
const gen=fs.readFileSync(path.join(base,"generator.js"),"utf8");
function ok(name, cond){if(!cond)throw new Error("FAIL: "+name);console.log("[ PASS ] "+name)}
ok("temporary QA field remains in simplified markup", html.includes("TEMP QA · PROJECT TRANSFER") && html.includes("qa-export-project") && html.includes("qa-import-project"));
ok("QA field forced visible in guided mode", css.includes("body.guided-mode .qa-transfer-tools{display:flex!important}"));
ok("Builder Mode switch hidden in guided mode only", css.includes("body.guided-mode .builder-mode-bar{display:none!important}"));
ok("CPB footer avatar doubled on desktop", css.includes("width:56px!important;height:56px!important"));
ok("CPB footer avatar doubled on mobile", css.includes("width:50px!important;height:50px!important"));
ok("Preview footer includes enlarged account avatar", app.includes("preview-footer-avatar") && app.includes("gokalp-hoodrat-signature.png"));
ok("Generated landing footer includes account avatar", gen.includes("cpb-portal-footer-avatar") && gen.includes("/ctb-shared/gokalp-hoodrat-signature.png"));
console.log("Pass 12.17 focused UI checks passed.");
