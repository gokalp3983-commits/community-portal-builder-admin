const fs = require('fs');
const assert = require('assert');
const css = fs.readFileSync('public/style.css', 'utf8');

assert(css.includes('RC Pass 4: vivid crypto canvas + section personality'), 'Pass 4 marker missing');
assert(css.includes('--rh-yellow:#f6ff63'), 'Lime/Robinhood-family yellow token missing');
assert(css.includes('--tangerine:#ff9a62'), 'Tangerine token missing');
assert(css.includes('radial-gradient(ellipse 62rem 38rem'), 'Ambient background treatment missing');
assert(css.includes('body.guided-mode #guided-project'), 'Project stage color treatment missing');
assert(css.includes('body.guided-mode #guided-nft-mint'), 'NFT stage color treatment missing');
assert(css.includes('--module-accent:255,154,98'), 'Per-module pastel palette missing');
assert(css.includes('body.guided-mode .action-buttons button:not(.preview-button)'), 'Primary CTA color treatment missing');
assert(!css.includes('body.advanced-mode{\n  --rh-yellow:#f6ff63'), 'Pass 4 theme leaked into Builder Mode');
console.log('PASS: Simplified v1 vivid canvas/color personality contract');
