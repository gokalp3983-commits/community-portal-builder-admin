"use strict";
const fs=require("fs"),path=require("path");
const css=fs.readFileSync(path.join(__dirname,"public/style.css"),"utf8");
const gen=fs.readFileSync(path.join(__dirname,"generator.js"),"utf8");
if(!css.includes("Pass 12.25")) throw new Error("Pass 12.23 footer was not superseded by Pass 12.25");
if(!gen.includes("border-radius:50%!important")) throw new Error("circular avatar regression");
console.log("Pass 12.23 footer test superseded by Pass 12.25; avatar regression check passed.");
