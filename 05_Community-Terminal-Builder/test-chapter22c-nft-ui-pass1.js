"use strict";
const fs=require("fs"),path=require("path"),assert=require("assert");
const root=path.resolve(__dirname,"..");
for(const dir of ["03_NFT-Collection-Terminal","03_NFT-Collection-Terminal-Multi-Phase"]){
  const index=fs.readFileSync(path.join(root,dir,"public/index.html"),"utf8");
  const portal=fs.readFileSync(path.join(root,dir,"public/terminal.html"),"utf8");
  const css=fs.readFileSync(path.join(root,dir,"public/style.css"),"utf8");
  for(const html of [index,portal]){
    assert(html.includes("COMMUNITY PORTAL"),`${dir}: shared Community Portal header missing`);
    assert(html.includes("NFT Portal</div>"),`${dir}: bright-orange NFT module subtitle missing`);
    assert(html.indexOf("NFT Portal</div>")<html.indexOf('class="online-status"'),`${dir}: NFT subtitle must sit above ONLINE`);
    assert(html.includes("portal-header-energy"),`${dir}: animated header divider missing`);
    assert(html.includes('id="backToTop"'),`${dir}: back-to-top button missing`);
  }
  assert(css.includes("CPB NFT PORTAL — NEW UI PASS 1"),`${dir}: new UI CSS missing`);
  assert(css.includes(".module-subtitle{color:var(--portal-orange)"),`${dir}: canonical subtitle accent missing`);
}
const generator=fs.readFileSync(path.join(__dirname,"generator.js"),"utf8");
assert(generator.includes('title:`${p.name} NFT Portal`'),"Generated Landing NFT module title must use Portal terminology");
console.log("✅ NFT Portal NEW UI Pass 1 template checks passed.");
