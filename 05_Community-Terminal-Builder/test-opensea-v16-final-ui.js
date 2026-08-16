"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
const ROOT=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const pages=["01_Landing-Page/public/style.css","02_Whale-Activity-Tracker/public/style.css","03_NFT-Collection-Terminal/public/style.css","03_NFT-Collection-Terminal-Multi-Phase/public/style.css","04_Meme-Intel/public/style.css","06_Community-Pulse/public/style.css","07_Timeline/public/style.css"];
for(const p of pages){const css=read(p);assert(css.includes("width:min(140px,37.5vw)!important"),`${p}: +25% desktop mascot missing`);assert(css.includes("width:min(130px,47.5vw)!important;height:53px!important"),`${p}: +25% mobile mascot missing`)}
for(const p of ["03_NFT-Collection-Terminal/public/style.css","03_NFT-Collection-Terminal-Multi-Phase/public/style.css"]){const css=read(p);assert(css.includes(".nft-sale-row{border-radius:12px!important;overflow:hidden!important}"),`${p}: rounded sale cards missing`);assert(css.includes("height:38px!important"),`${p}: wallet centering lock missing`);assert(css.includes(".nft-extra-link-copy{color:#fff!important"),`${p}: additional link typography missing`)}
const app=read("05_Community-Terminal-Builder/public/app.js");assert(app.includes("slice(0,6)"),"multi-colour edge palette background removal missing");assert(app.includes("backgroundRemoved:true"),"processed transparent mascot payload missing");
const html=read("05_Community-Terminal-Builder/public/index.html");assert(html.includes("opensea-autofill16"),"builder asset cache revision not bumped");assert(read("03_NFT-Collection-Terminal/public/terminal.html").includes("cpb-nft-final7"),"NFT generated CSS cache revision not bumped");
console.log("OpenSea V16 final UI regression checks passed.");
