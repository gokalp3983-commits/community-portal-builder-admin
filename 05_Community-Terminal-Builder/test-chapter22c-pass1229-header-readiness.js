const fs=require("fs");const path=require("path");
function pass(name,condition){if(!condition)throw new Error(`FAIL ${name}`);console.log(`[ PASS ] ${name}`)}
const root=path.resolve(__dirname,"..");
const landingCss=fs.readFileSync(path.join(root,"01_Landing-Page","public","style.css"),"utf8");
const landingHtml=fs.readFileSync(path.join(root,"01_Landing-Page","public","index.html"),"utf8");
const app=fs.readFileSync(path.join(__dirname,"public","app.js"),"utf8");
const server=fs.readFileSync(path.join(__dirname,"server.js"),"utf8");
const builderHtml=fs.readFileSync(path.join(__dirname,"public","index.html"),"utf8");
pass("hero panel background is transparent",/Pass 12\.29[\s\S]*?\.portal-hero\{[\s\S]*?background:transparent!important;[\s\S]*?background-image:none!important;/.test(landingCss));
pass("hero pseudo background is disabled",/\.portal-hero::before\{[\s\S]*?content:none!important;[\s\S]*?background:none!important;/.test(landingCss));
pass("landing assets cache-busted for 12.29",landingHtml.includes("chapter22c-pass1229"));
pass("builder assets cache-busted for 12.29",builderHtml.includes("22c-pass1229"));
pass("readiness requires three consecutive passes",app.includes("requiredConsecutive=3"));
pass("readiness includes settle window",app.includes("settleMs=8000"));
pass("readiness performs final acceptance check",app.includes("finalResponse=await fetch(\"/api/verify-terminal\""));
pass("public probes bypass cache",server.includes("_cpb_ready=${Date.now()}-${attempt}")&&server.includes('"cache-control":"no-cache"')&&server.includes('cache:"no-store"'));
console.log("Pass 12.29 focused checks passed.");
