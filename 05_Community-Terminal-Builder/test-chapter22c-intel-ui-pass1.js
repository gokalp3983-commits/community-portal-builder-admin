"use strict";
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const html = read("04_Meme-Intel/public/index.html");
const css = read("04_Meme-Intel/public/intel.css");
const shared = read("04_Meme-Intel/public/style.css");
const js = read("04_Meme-Intel/public/intel.js");
const whaleJs = read("02_Whale-Activity-Tracker/public/whale.js");
const whaleShared = read("02_Whale-Activity-Tracker/public/style.css");
const landingJs = read("01_Landing-Page/public/script.js");
const generator = read("05_Community-Terminal-Builder/generator.js");

assert(html.includes("Meme Intelligence Portal"), "Intel module subtitle/name must use Portal terminology");
assert(html.includes('class="module-subtitle">Meme Intelligence Portal'), "Intel module subtitle missing from shared header");
assert(html.indexOf("Meme Intelligence Portal</div>") < html.indexOf('class="online-status"'), "Intel subtitle must be above ONLINE");
assert(html.includes("portal-hero") && html.includes("portal-header-energy"), "Intel must use accepted portal hero/energy design");
assert(html.includes('id="backToTop"'), "Intel must include back-to-top control");
assert(html.includes('id="marketPriceChange"'), "Intel market price change indicator missing");
assert(html.includes('id="intelCommands"') && html.includes("intel-guide-subsection"), "Intel quick/all commands must share one tools card");
for (const cmd of ["status","scan","pulse","pressure","live","fresh","holders","risk","methodology","clear"]) {
  assert(html.includes(`data-guide-command="${cmd}"`), `Intel command hook missing: ${cmd}`);
}
for (const id of ["commandInput","history","boot","promptRow","marketPrice","marketCap","marketHolders","marketVolume","marketUpdated"]) {
  assert(html.includes(`id="${id}"`), `Protected Intel id missing: ${id}`);
}
assert(js.includes('window.history.scrollRestoration = "manual"'), "Intel refresh-to-top logic missing");
assert(js.includes('window.matchMedia("(max-width: 600px)").matches ? "24H CHANGE" : "24H PRICE CHANGE"'), "Intel compact mobile price-change label missing");
assert(js.includes("toFixed(5)"), "Intel USD price must use five decimals");
assert(shared.includes(".portal-hero") && shared.includes(".back-to-top"), "Intel shared accepted portal styling missing");
assert(css.includes(".intel-command-hub") && css.includes(".intel-guide-subsection"), "Intel merged command-card styling missing");
assert(css.includes("border-left:3px solid var(--portal-violet"), "Intel subsection accent rule missing");
assert(whaleJs.includes('?"24H CHANGE":"24H PRICE CHANGE"'), "Whale mobile 24H CHANGE label missing");
assert(whaleShared.includes("background:transparent!important;font-size:.62rem"), "Whale mobile inline price-change styling missing");
assert(landingJs.includes('? "24H CHANGE" : "24H PRICE CHANGE"'), "Landing shared mobile 24H CHANGE label missing");
assert(generator.includes('title:"Meme Intelligence Portal"'), "Generated Landing module name must use Meme Intelligence Portal");
console.log("✅ Chapter 22C Intel UI Pass 1 checks passed.");
