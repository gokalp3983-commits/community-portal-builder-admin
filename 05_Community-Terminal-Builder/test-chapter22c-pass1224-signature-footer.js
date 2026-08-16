"use strict";
const fs=require("fs"),path=require("path");
const css=fs.readFileSync(path.join(__dirname,"public/style.css"),"utf8");
const gen=fs.readFileSync(path.join(__dirname,"generator.js"),"utf8");
if(!css.includes("Pass 12.25")) throw new Error("Pass 12.24 footer was not superseded by Pass 12.25");
if(gen.includes("cpb-portal-footer-center")) throw new Error("three-piece footer residue in generator");
console.log("Pass 12.24 footer test superseded by Pass 12.25; rollback check passed.");
