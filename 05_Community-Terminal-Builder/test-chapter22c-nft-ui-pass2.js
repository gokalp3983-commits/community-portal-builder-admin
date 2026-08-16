"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
const ROOT=path.resolve(__dirname,"..");
for(const dir of ["03_NFT-Collection-Terminal","03_NFT-Collection-Terminal-Multi-Phase"]){
 const pub=path.join(ROOT,dir,"public");
 const term=fs.readFileSync(path.join(pub,"terminal.html"),"utf8");
 const css=fs.readFileSync(path.join(pub,"style.css"),"utf8");
 const runtime=fs.readFileSync(path.join(pub,"project-runtime.js"),"utf8");
 assert(term.includes('class="nft-tools-card"'),`${dir}: unified NFT tools card missing`);
 assert(term.includes('Quick Commands')&&term.includes('Available Commands'),`${dir}: modern tool titles missing`);
 assert(!term.includes('id="additionalLinks"'),`${dir}: generic additional links must not render on NFT portal`);
 assert(term.includes('id="boot" hidden'),`${dir}: public boot/status log must be removed`);
 assert(css.includes('grid-template-columns:minmax(0,1100px) minmax(390px,460px)'),`${dir}: Market Update width missing`);
 assert(css.includes('min-height:calc(100vh - 24px)'),`${dir}: Market Update full-height rule missing`);
 assert(css.includes('.nft-full-footer{grid-column:1 / -1'),`${dir}: NFT footer must span both columns`);
 assert(css.includes('.community-title-row h1{color:var(--portal-yellow)!important}'),`${dir}: canonical yellow main header title missing`);
 assert(css.includes('.module-subtitle{color:var(--portal-orange)!important}'),`${dir}: orange module subtitle missing`);
 assert(!runtime.includes('additionalLinksHost'),`${dir}: NFT runtime must not inject generic additional links`);
}
const single=fs.readFileSync(path.join(ROOT,"03_NFT-Collection-Terminal/public/countdown.js"),"utf8");
const multi=fs.readFileSync(path.join(ROOT,"03_NFT-Collection-Terminal-Multi-Phase/public/countdown.js"),"utf8");
assert(single.includes('MINT COMPLETE')&&single.includes('MINT LIVE')&&single.includes('singlePhaseInfo()'),"single: lifecycle text/phase history missing");
assert(multi.includes('MINT COMPLETE')&&multi.includes('MINT LIVE')&&multi.includes('compactPhaseInfo()'),"multi: lifecycle text/phase history missing");
const app=fs.readFileSync(path.join(ROOT,"05_Community-Terminal-Builder/public/app.js"),"utf8");
assert(app.includes('pastScheduleAcknowledgedSignature=sig;pastScheduleWarningSignature=sig'),"past-time warning must acknowledge after one display/dismissal");
console.log("PASS Chapter 22C NFT UI Pass 2 refinements");
