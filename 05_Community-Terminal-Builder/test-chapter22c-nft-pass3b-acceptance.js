"use strict";
const assert=require("assert"),fs=require("fs"),os=require("os"),path=require("path"),{execFileSync}=require("child_process"),{generate}=require("./generator");
const root=path.resolve(__dirname,"..");
for(const name of ["03_NFT-Collection-Terminal","03_NFT-Collection-Terminal-Multi-Phase"]){
  const pub=path.join(root,name,"public");
  const html=fs.readFileSync(path.join(pub,"terminal.html"),"utf8");
  const css=fs.readFileSync(path.join(pub,"style.css"),"utf8");
  assert(html.includes("style.css?v=cpb-nft-final4"),`${name}: NFT style cache version missing`);
  assert(html.includes("script.js?v=cpb-nft-final4"),`${name}: NFT script cache version missing`);
  assert(!/\[\s*LIVE\s*\][^<]*Tracking the/.test(html),`${name}: legacy LIVE tracking prefix returned`);
  assert(css.includes("CPB NFT PORTAL — PASS 3B ACCEPTANCE LOCK"),`${name}: pass 3B CSS lock missing`);
  assert(css.includes(".nft-sales-window{position:relative!important;top:auto!important;height:auto!important;min-height:100vh!important;align-self:stretch!important"),`${name}: sales sidebar stretch lock missing`);
}
const builderCss=fs.readFileSync(path.join(__dirname,"public/style.css"),"utf8");
assert(/#deployment-success-close\{[^}]*rgba\(255,74,86/.test(builderCss),"Deployment success CLOSE button is not red");
const generator=fs.readFileSync(path.join(__dirname,"generator.js"),"utf8");
assert(generator.includes('var nftGrid=document.querySelector(".nft-terminal-workspace")'),"Canonical footer does not detect NFT grid");
assert(generator.includes('.nft-terminal-workspace>.ctb-shared-footer-host{grid-column:1/-1'),"NFT shared footer grid-span CSS missing");
const input={projectName:"PORTALCAT",ticker:"PCAT",description:"NFT 3B acceptance",tokenContract:"0x1111111111111111111111111111111111111111",nftContract:"0x2222222222222222222222222222222222222222",blockscoutApiBase:"https://eth.blockscout.com/api/v2",links:{openSea:"https://opensea.io/collection/portalcat",x:"https://x.com/portalcat"},features:{whaleTracker:true,memeIntel:true,nftTerminal:true,communityPulse:true,timeline:true,liveMarket:true},nft:{collectionName:"PORTALCAT NFT",supply:420,mode:"single",mintAt:"2026-08-20T19:00:00+03:00",mintPrice:"0.01 ETH",mintLimit:"2",timezone:"Europe/Bucharest"}};
const out=generate(input),dir=fs.mkdtempSync(path.join(os.tmpdir(),"cpb-3b-")),zip=path.join(dir,out.filename);fs.writeFileSync(zip,out.buffer);execFileSync("unzip",["-q",zip,"-d",dir]);
try{
 const generatedRoot=path.join(dir,"PORTALCAT_Community_Terminal");
 const html=fs.readFileSync(path.join(generatedRoot,"03_NFT-Collection-Terminal/public/terminal.html"),"utf8");
 const footer=fs.readFileSync(path.join(generatedRoot,"03_NFT-Collection-Terminal/public/canonical-footer.js"),"utf8");
 assert(html.includes('/nft/style.css?v=cpb-nft-final4'),"Generated NFT style cache-buster was stripped");
 assert(html.includes('/nft/script.js?v=cpb-nft-final4'),"Generated NFT script cache-buster was stripped");
 assert(footer.includes('var nftGrid=document.querySelector(".nft-terminal-workspace")'),"Generated NFT footer runtime does not target full workspace");
 assert(!html.includes('<span class="green">[ LIVE ]</span> Tracking the'),"Generated legacy tracking prefix present");
} finally {fs.rmSync(dir,{recursive:true,force:true});}
console.log("PASS NFT Pass 3B acceptance locks");
