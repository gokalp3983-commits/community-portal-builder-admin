const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');

const requiredHtml = [
  'contract-field simple-nft-config',
  'class="span-2 simple-nft-locked"',
  'Select an NFT or Token + NFT baseline'
];
for (const token of requiredHtml) {
  if (!html.includes(token)) throw new Error(`Missing progressive NFT HTML token: ${token}`);
}

const requiredJs = [
  'document.body.classList.toggle("nft-module-disabled",!enabled)',
  'document.querySelectorAll(".nft-config").forEach(el=>{el.hidden=!enabled})'
];
for (const token of requiredJs) {
  if (!js.includes(token)) throw new Error(`Missing progressive NFT JS token: ${token}`);
}

const requiredCss = [
  'body.guided-mode.nft-module-disabled .simple-nft-config{display:none!important}',
  'body.guided-mode.nft-module-disabled .simple-nft-locked{display:flex',
  'body.advanced-mode .simple-nft-locked{display:none!important}'
];
for (const token of requiredCss) {
  if (!css.includes(token)) throw new Error(`Missing progressive NFT CSS token: ${token}`);
}

console.log('PASS: CPB Simplified v1 progressive NFT disclosure');
