"use strict";
const fs=require("fs"), path=require("path"), assert=require("assert");
const root=path.resolve(__dirname,"..");
const pages=[
"01_Landing-Page/public/index.html","02_Whale-Activity-Tracker/public/index.html","03_NFT-Collection-Terminal/public/index.html","03_NFT-Collection-Terminal/public/terminal.html","03_NFT-Collection-Terminal-Multi-Phase/public/index.html","03_NFT-Collection-Terminal-Multi-Phase/public/terminal.html","04_Meme-Intel/public/index.html","06_Community-Pulse/public/index.html","07_Timeline/public/index.html"];
for(const rel of pages){const s=fs.readFileSync(path.join(root,rel),"utf8");assert(!s.includes('),1800)</script>'),`${rel}: old 1.8s reveal timeout remains`);assert(s.includes('8000'),`${rel}: robust fallback missing`);assert(s.includes('remaining=links.length'),`${rel}: stylesheet-settle guard missing`)}
const landing=fs.readFileSync(path.join(root,"01_Landing-Page/public/script.js"),"utf8");
assert(landing.includes('attempts: hasMarketData ? 1 : 4'),"initial market retry missing");
assert(landing.includes('500 * attempt'),"market retry backoff missing");
console.log("PASS RC first-load reliability");
