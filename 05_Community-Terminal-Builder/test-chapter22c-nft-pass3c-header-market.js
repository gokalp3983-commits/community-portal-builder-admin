'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const modules = ['03_NFT-Collection-Terminal','03_NFT-Collection-Terminal-Multi-Phase'];
for (const mod of modules) {
  const pub = path.join(root, mod, 'public');
  const css = fs.readFileSync(path.join(pub,'style.css'),'utf8');
  const runtime = fs.readFileSync(path.join(pub,'project-runtime.js'),'utf8');
  const index = fs.readFileSync(path.join(pub,'index.html'),'utf8');
  const terminal = fs.readFileSync(path.join(pub,'terminal.html'),'utf8');
  if (!/\.community-title-row h1\s*\{[^}]*color:#ccff00!important;/s.test(css)) throw new Error(`${mod}: final canonical #ccff00 title lock missing`);
  if (!runtime.includes('"NFT MARKET UPDATE"')) throw new Error(`${mod}: runtime NFT MARKET UPDATE label missing`);
  if (!/\.nft-sales-window::before\s*\{[^}]*text-align:center!important;/s.test(css)) throw new Error(`${mod}: centered market update heading missing`);
  if (!index.includes('cpb-nft-final7') || !terminal.includes('cpb-nft-final7')) throw new Error(`${mod}: pass3c asset cache version missing`);
}
console.log('PASS Chapter 22C NFT Pass 3C header + market update lock');
