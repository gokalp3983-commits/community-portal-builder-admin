"use strict";
const assert=require("assert"),fs=require("fs"),os=require("os"),path=require("path"),{execFileSync}=require("child_process"),{generate}=require("./generator");
const common={projectName:"HOODRAT",ticker:"HOOD",description:"NFT Pass2 generation test",tokenContract:"0x1111111111111111111111111111111111111111",nftContract:"0x2222222222222222222222222222222222222222",blockscoutApiBase:"https://eth.blockscout.com/api/v2",links:{openSea:"https://opensea.io/collection/hoodrat",x:"https://x.com/hoodrat",additionalLinks:[{label:"DEX",text:"Dexscreener",url:"https://dexscreener.com/ethereum/test"}]},features:{whaleTracker:true,memeIntel:true,nftTerminal:true,communityPulse:true,timeline:true,liveMarket:true}};
function unpack(result){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"cpb-nft-ui2-")),zip=path.join(dir,result.filename);fs.writeFileSync(zip,result.buffer);execFileSync("unzip",["-q",zip,"-d",dir]);return {dir,root:path.join(dir,"HOODRAT_Community_Terminal")}}
function verify(input,label){const x=unpack(generate(input));try{
 const base=path.join(x.root,"03_NFT-Collection-Terminal/public");
 const launch=fs.readFileSync(path.join(base,"index.html"),"utf8"),portal=fs.readFileSync(path.join(base,"terminal.html"),"utf8"),css=fs.readFileSync(path.join(base,"style.css"),"utf8"),runtime=fs.readFileSync(path.join(base,"project-runtime.js"),"utf8"),countdown=fs.readFileSync(path.join(base,"countdown.js"),"utf8");
 assert(portal.includes('class="nft-tools-card"'),`${label}: generated unified tools card missing`);
 assert(!portal.includes('id="additionalLinks"'),`${label}: generated NFT page leaked generic additional links`);
 assert(!runtime.includes('additionalLinksHost'),`${label}: generated NFT runtime still injects generic links`);
 assert(portal.includes('id="boot" hidden'),`${label}: generated diagnostic status log remains visible`);
 assert(css.includes('CPB NFT PORTAL — NEW UI PASS 2'),`${label}: Pass2 CSS missing`);
 assert(css.includes('.community-title-row h1{color:var(--portal-yellow)!important}'),`${label}: canonical yellow title missing`);
 assert(css.includes('minmax(390px,460px)'),`${label}: Market Update width missing`);
 assert(css.includes('.nft-full-footer{grid-column:1 / -1'),`${label}: full-layout footer missing`);
 assert(countdown.includes('MINT LIVE')&&countdown.includes('MINT COMPLETE'),`${label}: exact lifecycle copy missing`);
 if(label==='single') assert(countdown.includes('singlePhaseInfo()'),`${label}: completed phase history missing`);
 else assert(countdown.includes('compactPhaseInfo()'),`${label}: completed phase history missing`);
 assert(launch.includes('HOODRAT COMMUNITY PORTAL'),`${label}: countdown title missing`);
}finally{fs.rmSync(x.dir,{recursive:true,force:true})}}
verify({...common,nft:{collectionName:"HOODRAT NFT",supply:2222,mode:"single",mintAt:"2026-08-15T10:00:00+03:00",mintEndAt:"2026-08-15T10:30:00+03:00",mintPrice:"0.01 ETH",mintLimit:"2",timezone:"Europe/Bucharest"}},"single");
verify({...common,nft:{collectionName:"HOODRAT NFT",supply:2222,mode:"multiple",timezone:"Europe/Bucharest",mintPhases:[{id:"og",label:"OG",name:"OG Access",startsAt:"2026-08-15T09:00:00+03:00",endsAt:"2026-08-15T10:00:00+03:00",timezone:"Europe/Bucharest",price:"FREE",limit:"1"},{id:"public",label:"PUBLIC",name:"Public Mint",startsAt:"2026-08-15T10:00:00+03:00",endsAt:"2026-08-15T10:30:00+03:00",timezone:"Europe/Bucharest",price:"0.01 ETH",limit:"2"}]}},"multiple");
console.log("✅ Generated NFT Pass2 single/multiple checks passed.");
