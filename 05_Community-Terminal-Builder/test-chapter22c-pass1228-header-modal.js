"use strict";
const fs=require("fs"),path=require("path");
function ok(v,m){if(!v)throw new Error(m);console.log(`[ PASS ] ${m}`)}
const landingCss=fs.readFileSync(path.join(__dirname,"..","01_Landing-Page","public","style.css"),"utf8");
const landingJs=fs.readFileSync(path.join(__dirname,"..","01_Landing-Page","public","script.js"),"utf8");
const builderCss=fs.readFileSync(path.join(__dirname,"public","style.css"),"utf8");
const builderJs=fs.readFileSync(path.join(__dirname,"public","app.js"),"utf8");
ok(landingCss.includes("Pass 12.28 — final Landing Page header cleanup"),"Pass 12.28 landing header override exists");
ok(/\.portal-hero::after\{[\s\S]*?content:none!important;[\s\S]*?display:none!important/.test(landingCss),"Legacy header accent line is disabled");
ok(/\.portal-hero\{[\s\S]*?border:0!important;[\s\S]*?box-shadow:none!important/.test(landingCss),"Landing header is borderless");
ok(landingJs.includes("async function normalizeMascotBackground"),"Safe mascot background normalization exists");
ok(landingJs.includes("normalizeMascotBackground(mascotImage)"),"Mascot normalization runs on configured mascot");
ok(builderJs.includes("if(processedMascot)return mascotDataUriFromPayload(processedMascot)"),"Preview prioritizes processed transparent mascot");
ok(builderCss.includes("Pass 12.28 — deployment modal viewport safety"),"Viewport safety CSS exists");
ok(builderCss.includes("max-height:calc(100dvh - 24px)!important"),"Build dialog is capped to dynamic viewport");
ok(builderCss.includes("position:sticky!important")&&builderCss.includes(".build-actions.final-product-actions"),"Deployment action bar stays reachable");
console.log("Pass 12.28 focused checks passed.");
