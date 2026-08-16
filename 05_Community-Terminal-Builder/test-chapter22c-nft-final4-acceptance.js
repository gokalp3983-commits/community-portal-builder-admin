const fs=require("fs"),path=require("path"),assert=require("assert");
const ROOT=path.join(__dirname,"..");
const read=(...p)=>fs.readFileSync(path.join(ROOT,...p),"utf8");
const singleIndex=read("03_NFT-Collection-Terminal","public","index.html");
const multiIndex=read("03_NFT-Collection-Terminal-Multi-Phase","public","index.html");
const singleCss=read("03_NFT-Collection-Terminal","public","countdown.css");
const multiCss=read("03_NFT-Collection-Terminal-Multi-Phase","public","countdown.css");
const multiJs=read("03_NFT-Collection-Terminal-Multi-Phase","public","countdown.js");
const builderCss=read("05_Community-Terminal-Builder","public","style.css");
const builderJs=read("05_Community-Terminal-Builder","public","app.js");
assert(!multiIndex.includes('__CTB_X_URL__'),"multi countdown must not expose project X access card");
for(const html of [singleIndex,multiIndex]){assert(html.includes('VISIT OPENSEA'));assert(html.includes('VISIT NFT PORTAL'));assert(!html.includes('[ VISIT OPENSEA ]'));assert(html.includes('cpb-nft-final4'));}
assert(multiJs.includes('pageState.textContent = "MINT COMPLETE"'),"multi page state must show MINT COMPLETE after final phase");
assert(multiJs.includes('pageState.textContent = "MINT LIVE"'),"multi page state must show MINT LIVE while active");
assert(multiCss.includes('border:1px solid rgba(180,140,255,.68)!important'),"phase borders must be purple");
assert(multiCss.includes('border-radius:15px!important'),"phase cards must be rounded");
assert(multiCss.includes('width:min(1080px,calc(100% - 28px))!important'),"multi countdown width must match portal rhythm");
for(const css of [singleCss,multiCss]) assert(css.includes('CPB NFT FINAL countdown actions'),"modern countdown buttons missing");
assert(builderCss.includes('#nft-mint-confirmed-state.warn'),"required confirmation warning style missing");
assert(builderCss.includes('#confirm-nft-mint-details:not(.is-confirmed)'),"pending confirm button red state missing");
assert(builderJs.includes('CONFIRMATION REQUIRED — confirm NFT mint details'),"confirmation warning copy missing");
assert(builderCss.includes('.nft-mint-confirm-actions #nft-mint-edit'),"CHANGE/EDIT yellow style missing");
for(const d of ["03_NFT-Collection-Terminal","03_NFT-Collection-Terminal-Multi-Phase"]){const css=read(d,"public","style.css");assert(css.includes('grid-row:2!important;min-height:0!important'),"mobile Market Update order lock missing");assert(css.includes('grid-row:3!important;margin-top:0!important'),"mobile footer order lock missing");assert(css.includes('color:#ccff00!important'),"canonical NFT header color lock missing");}
console.log("PASS Chapter 22C NFT final4 acceptance lock");
