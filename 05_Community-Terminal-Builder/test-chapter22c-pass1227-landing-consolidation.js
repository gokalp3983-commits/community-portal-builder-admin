"use strict";
const fs=require("fs");
const path=require("path");
const root=path.join(__dirname,"..","01_Landing-Page","public");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"style.css"),"utf8");
const js=fs.readFileSync(path.join(root,"script.js"),"utf8");
const app=fs.readFileSync(path.join(__dirname,"public","app.js"),"utf8");
function ok(v,m){if(!v)throw new Error(m);console.log("PASS",m)}
ok(!html.includes('class="quick-access portal-panel"'),"Quick Access panel removed from Landing Page");
ok(html.includes('class="portal-header-energy"')&&html.includes('energy-lime')&&html.includes('energy-violet'),"header uses canonical animated double divider");
ok(css.includes('.portal-hero{\n  border:0!important;')&&css.includes('box-shadow:none!important'),"header card border removed");
ok(css.includes('#terminal-live-panel #marketPrice')&&css.includes('color:var(--portal-orange)!important'),"market orange override wins legacy specificity");
ok(css.includes('#terminal-live-panel .project-link-row .project-link-value{color:#ffb85c!important'),"warm social link override wins legacy specificity");
ok(js.includes('module-launch-button')&&js.includes('row.append(button, title, copy)'),"available modules owns direct launch buttons");
ok(css.includes('.portal-modules-grid{grid-template-columns:1fr!important')&&css.includes('.module-launch-row{'),"module area is one full-width div");
ok(html.includes('style.css?v=chapter22c-pass1230')&&html.includes('script.js?v=chapter22c-pass1230'),"Landing Page assets cache-busted for latest Pass 12.30");
ok(app.includes('Pass 12.27 preview alignment')&&app.includes('AVAILABLE MODULES')&&!app.includes('<h2>Quick Access</h2>'),"Preview aligned to one-module-panel direction");
