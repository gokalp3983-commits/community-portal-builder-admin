"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
const app=fs.readFileSync(path.join(__dirname,"public/app.js"),"utf8");
const css=fs.readFileSync(path.join(__dirname,"public/style.css"),"utf8");
assert(app.includes('source:"saved-project-load"'),"Loaded-project acceptance marker missing");
assert(app.includes('Public acceptance ready.'),"Loaded-project user status missing");
assert(app.includes('acceptance:{ok:true'),"Loaded saved projects must satisfy public acceptance");
assert(css.includes('.terminal-ready-link{margin:12px 18px 0!important'),"LIVE PORTAL spacing missing");
console.log("Chapter 22C loaded-project acceptance + live-card spacing: PASS");
