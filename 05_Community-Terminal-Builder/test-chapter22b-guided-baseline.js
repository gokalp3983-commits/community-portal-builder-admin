const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('public/index.html','utf8');
const js=fs.readFileSync('public/app.js','utf8');
const css=fs.readFileSync('public/style.css','utf8');
assert(html.includes('Please select your portal baseline'),'baseline prompt missing');
for(const value of ['token','nft','both']) assert(html.includes(`name="terminalBaseline" value="${value}"`),`baseline option ${value} missing`);
const moduleOrder=['data-module="landing"','data-module="whales"','data-module="intel"','data-module="nft"','data-module="timeline"','data-module="pulse"'];
let last=-1;for(const marker of moduleOrder){const i=html.indexOf(marker);assert(i>last,`module order broken at ${marker}`);last=i;}
assert(js.includes('function syncTerminalBaseline'),'baseline sync logic missing');
assert(js.includes('setModuleState("liveMarket",{checked:true,disabled:true,state:"required"})'),'token/both landing requirement missing');
assert(js.includes('setModuleState("nftTerminal",{checked:true,disabled:true,state:"required"})'),'NFT baseline requirement missing');
assert(js.includes('for(const name of ["liveMarket","whaleTracker","memeIntel"])setModuleState(name,{checked:false,disabled:true,state:"unavailable"})'),'NFT-only token-module lock missing');
assert(js.includes('baselineReady=!document.body.classList.contains("guided-mode")||Boolean(terminalBaseline())'),'baseline readiness gate missing');
assert(css.includes('body.guided-mode.baseline-nft .simple-token-config{display:none!important}'),'NFT-only Token CA hiding missing');
assert(css.includes('body.guided-mode.baseline-unselected .baseline-modules-lock{display:flex}'),'module lock prompt missing');
console.log('PASS chapter22b guided portal baseline flow');
