"use strict";
const fs=require("fs");
const path=require("path");
const root=path.join(__dirname,"..","01_Landing-Page","public");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"style.css"),"utf8");
const js=fs.readFileSync(path.join(root,"script.js"),"utf8");
function ok(v,m){if(!v)throw new Error(m);console.log("PASS",m)}
ok(!html.includes('<div class="portal-kicker">COMMUNITY PORTAL</div>'),"legacy top-left COMMUNITY PORTAL kicker removed");
ok(!html.includes('<h2>System</h2>'),"System subheading removed from Portal Status");
ok(css.includes('color:var(--portal-lime)!important')&&css.includes('font-size:clamp(1.25rem,3.3vw,2.05rem)!important'),"hero title is Robinhood lime and smaller");
ok(css.includes('.online-status{')&&css.includes('color:var(--portal-green)!important'),"ONLINE uses neon green");
ok(js.includes('function formatUsdPrice')&&js.includes('numeric.toFixed(5)'),"USD price renders at five decimal places");
ok(css.includes('#marketPrice,#marketCap,#marketHolders,#marketVolume{color:var(--portal-orange)!important}'),"core market values are orange");
ok(css.includes('.project-link-row .project-link-value{color:#ffb85c!important'),"social/project links use warm accent");
ok(css.includes('.portal-system-panel .portal-section-kicker,.portal-system-panel .portal-section-heading h2{color:var(--portal-green)!important}'),"Portal Status title matches green border");
ok(css.includes('.quick-access .portal-section-kicker,.quick-access .portal-section-heading h2{color:var(--portal-aqua)!important}'),"Quick Access title matches ice-blue border");
