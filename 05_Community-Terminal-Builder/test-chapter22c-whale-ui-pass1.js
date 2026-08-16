"use strict";
const fs=require("fs");
const path=require("path");
const assert=(condition,message)=>{if(!condition)throw new Error(message);console.log(`PASS ${message}`)};
const root=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(root,"02_Whale-Activity-Tracker/public/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"02_Whale-Activity-Tracker/public/whale.css"),"utf8");
const shared=fs.readFileSync(path.join(root,"02_Whale-Activity-Tracker/public/style.css"),"utf8");
const js=fs.readFileSync(path.join(root,"02_Whale-Activity-Tracker/public/whale.js"),"utf8");
const landing=fs.readFileSync(path.join(root,"01_Landing-Page/public/style.css"),"utf8");
assert(shared===landing,"Whales uses the accepted Landing Page shared stylesheet");
assert(html.includes("{{PROJECT_NAME}} COMMUNITY PORTAL"),"Whales uses Community Portal terminology in the shared header");
assert(html.includes('<div class="module-subtitle">Whale Activity Tracker</div>'),"Landing module name is reused exactly as the orange module subtitle");
assert(html.indexOf('module-subtitle')<html.indexOf('online-status'),"Module subtitle sits above/before ONLINE in the header structure");
assert(css.includes('.module-subtitle{')&&css.includes('color:var(--portal-orange'),"Module subtitle uses the bright-orange portal accent");
assert(html.includes('class="portal-header-energy"')&&html.includes('energy-lime')&&html.includes('energy-violet'),"Accepted animated header divider is present");
for(const id of ["marketPanel","boot","whaleCommands","history","promptRow","commandInput"]){assert(html.includes(`id="${id}"`),`Protected Whale hook #${id} is preserved`)}
for(const command of ["whales","whales12","activity","movers","stats"]){assert(html.includes(`data-quick-command="${command}"`),`Quick command ${command} is preserved`)}
assert(html.includes('id="backToTop"'),"Whales includes the shared back-to-top control");
assert(js.includes('window.history.scrollRestoration="manual"')&&js.includes('window.scrollTo(0,0)'),"Whales starts at the top after refresh/navigation restoration");
assert(js.includes('window.scrollTo({top:0,behavior:"smooth"})'),"Whales back-to-top control uses smooth scroll");
assert(html.includes('data-project-footer'),"Shared generated footer hook is preserved");
console.log("Whale Activity Tracker NEW UI Pass 1 checks passed.");
