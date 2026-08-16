"use strict";
const fs=require("fs");
const path=require("path");
const assert=require("assert");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const pulseHtml=read("06_Community-Pulse/public/index.html");
const pulseCss=read("06_Community-Pulse/public/pulse.css");
const pulseJs=read("06_Community-Pulse/public/pulse.js");
const pulseRuntime=read("06_Community-Pulse/public/project-runtime.js");
const pulseShared=read("06_Community-Pulse/public/style.css");
const landingShared=read("01_Landing-Page/public/style.css");
const landingJs=read("01_Landing-Page/public/script.js");
const whaleJs=read("02_Whale-Activity-Tracker/public/whale.js");
const intelJs=read("04_Meme-Intel/public/intel.js");
const intelCss=read("04_Meme-Intel/public/intel.css");

assert(pulseHtml.includes('class="module-subtitle">Community Pulse</div>'),"Pulse must use exact Landing module name");
assert(pulseHtml.indexOf('module-subtitle">Community Pulse')<pulseHtml.indexOf('class="online-status"'),"Pulse subtitle must sit above ONLINE");
assert(pulseHtml.includes("portal-hero")&&pulseHtml.includes("portal-header-energy"),"Pulse must use locked shared portal header");
assert(pulseHtml.includes('id="backToTop"'),"Pulse must include shared back-to-top control");
for(const id of ["pulseStatus","marketState","marketEvidence","holderState","holderEvidence","whaleState","whaleEvidence","freshState","freshEvidence","nftState","nftEvidence","overallState","overallEvidence"]){
  assert(pulseHtml.includes(`id="${id}"`),`Pulse protected id missing: ${id}`);
}
assert(pulseShared===landingShared,"Pulse must use exact accepted shared portal stylesheet");
assert(pulseCss.includes('border-left:3px solid var(--pulse-accent)')&&pulseCss.includes('color:var(--pulse-accent)'),"Pulse card title must inherit its left-border accent");
assert(pulseCss.includes('.pulse-overall{--pulse-accent:var(--portal-lime'),"Pulse overall signal must have dedicated accent");
assert(pulseJs.includes('history.scrollRestoration="manual"'),"Pulse refresh-to-top logic missing");
assert(pulseJs.includes('backToTop.addEventListener("click"'),"Pulse back-to-top behavior missing");
assert(!pulseRuntime.includes('Community Terminal'),"Pulse runtime must use Portal terminology");
for(const [name,src] of [["Landing",landingJs],["Whales",whaleJs],["Intel",intelJs]]) assert(src.includes('24H CHANGE')&&src.includes('24H PRICE CHANGE'),`${name} must use mobile 24H CHANGE and desktop 24H PRICE CHANGE`);
assert(landingShared.includes('flex-direction:column!important')&&landingShared.includes('grid-area:value!important'),"Shared mobile price stack must be left-aligned in the value area");
assert(intelCss.includes('gap:14px!important'),"Intel major-card spacing refinement missing");
console.log("✅ Community Pulse NEW UI + shared refinement checks passed.");
