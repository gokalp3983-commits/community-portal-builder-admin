"use strict";
const fs=require("fs");
const path=require("path");
const root=path.join(__dirname,"..","01_Landing-Page","public");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"style.css"),"utf8");
const js=fs.readFileSync(path.join(root,"script.js"),"utf8");
function ok(condition,message){if(!condition)throw new Error(message);console.log("PASS",message)}
ok(js.includes("numeric.toFixed(5)"),"Landing price uses five digits after the decimal");
ok(!js.includes("numeric.toFixed(3)"),"Legacy three-decimal Landing price format removed");
ok(js.includes('history.scrollRestoration = "manual"'),"Landing disables browser scroll restoration");
ok(js.includes("window.scrollTo(0, 0)"),"Landing explicitly starts at the top");
ok(js.includes('window.addEventListener("pageshow"'),"Landing reapplies top position after navigation restoration");
ok(html.includes('id="backToTop"')&&html.includes('class="back-to-top"'),"Landing includes back-to-top control");
ok(js.includes('window.scrollY > 420')&&js.includes('behavior: "smooth"'),"Back-to-top visibility and smooth scroll match CPB main behavior");
ok(css.includes('.back-to-top{')&&css.includes('background:#ccff00'),"Back-to-top control uses CPB lime styling");
ok(css.includes('@media(max-width:720px){.back-to-top{right:14px;bottom:14px;width:44px;height:44px}}'),"Back-to-top mobile sizing is preserved");
console.log("Landing Page Fix-1 / Fix-2 checks passed.");
