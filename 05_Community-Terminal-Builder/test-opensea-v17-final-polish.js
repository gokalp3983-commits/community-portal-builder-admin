"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
const ROOT=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const pages=["01_Landing-Page/public/style.css","02_Whale-Activity-Tracker/public/style.css","03_NFT-Collection-Terminal/public/style.css","03_NFT-Collection-Terminal-Multi-Phase/public/style.css","04_Meme-Intel/public/style.css","06_Community-Pulse/public/style.css","07_Timeline/public/style.css"];
for(const p of pages){const css=read(p);assert(css.includes("background:#000000!important"),`${p}: pure-black canvas missing`);assert(css.includes("width:min(175px,46.9vw)!important;height:69px!important"),`${p}: +25% desktop mascot missing`);assert(css.includes("width:min(163px,59.4vw)!important;height:66px!important"),`${p}: +25% mobile mascot missing`)}
for(const p of ["03_NFT-Collection-Terminal/public/style.css","03_NFT-Collection-Terminal-Multi-Phase/public/style.css"]){const css=read(p);assert(css.includes(".nft-sales-list>.nft-sale-row{border-radius:16px!important"),`${p}: rounded sale cards missing`);assert(css.includes(".nft-extra-link-row>a{justify-self:end!important"),`${p}: collection-access link alignment missing`);assert(css.includes("height:38px!important"),`${p}: wallet alignment regression`)}
const gen=read("05_Community-Terminal-Builder/generator.js");assert(gen.includes('official-mint nft-extra-link-row'),"additional link does not reuse Collection Access component geometry");assert(!gen.includes('nft-extra-link-action\">OPEN'),"legacy OPEN action still generated");
const app=read("05_Community-Terminal-Builder/public/app.js");assert(app.includes("const expected=(x,y)=>"),"gradient-aware background model missing");assert(app.includes("backgroundRemoved:true"),"processed transparent mascot payload missing");
const html=read("05_Community-Terminal-Builder/public/index.html");assert(html.includes("opensea-autofill17"),"builder asset cache revision not bumped");assert(read("03_NFT-Collection-Terminal/public/terminal.html").includes("cpb-nft-final8-v17"),"NFT generated CSS cache revision not bumped");
console.log("OpenSea V17 final polish regression checks passed.");
