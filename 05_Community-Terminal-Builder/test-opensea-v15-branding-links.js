"use strict";
const assert=require("assert"),fs=require("fs"),path=require("path");
const ROOT=__dirname;
const app=fs.readFileSync(path.join(ROOT,"public/app.js"),"utf8");
const gen=fs.readFileSync(path.join(ROOT,"generator.js"),"utf8");
assert(app.includes("Build a small palette from the most common colours around the full image edge"),"multi-colour edge background removal missing");
assert(gen.includes("function nftAdditionalLinksMarkup"),"NFT additional links generator missing");
assert(gen.includes('id="additionalLinks" class="nft-additional-links"'),"NFT additional links markup missing");
assert(gen.includes('public/terminal.html'),"NFT terminal injection missing");
for(const rel of ["../03_NFT-Collection-Terminal/public/style.css","../03_NFT-Collection-Terminal-Multi-Phase/public/style.css"]){
  const css=fs.readFileSync(path.join(ROOT,rel),"utf8");
  assert(css.includes("CPB OpenSea V15 — generated NFT Additional Links"),`${rel}: modern additional-link styles missing`);
}
console.log("OpenSea V15 branding + NFT additional links: PASS");
