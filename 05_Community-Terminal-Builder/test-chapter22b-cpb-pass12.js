const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('public/index.html','utf8');
const css=fs.readFileSync('public/style.css','utf8');
const app=fs.readFileSync('public/app.js','utf8');

assert(!html.includes('cpb-culture-art simple-only'), 'decorative background art must be removed from HTML');
assert(html.includes('class="motto-letter"'), 'header motto must be letter-by-letter');
assert(html.includes('<div class="footer-tagline">Build. Launch. Grow.</div>'), 'footer must carry static motto');
assert(css.includes('background:#39ff14!important'), 'baseline selected square must use neon green');
assert(css.includes('.terminal-baseline-options label:has(input:checked)'), 'selected baseline card state must follow native radio selection');
assert(css.includes('.checks input:checked'), 'module filled-square selection must remain');
assert(css.includes('body.guided-mode::before,body.guided-mode::after{content:none!important'), 'decorative pseudo background must be disabled');
assert(css.includes('cpb-letter-reveal'), 'letter reveal animation must exist');
assert(css.includes('margin:4px auto 7px!important;padding:17px 22px!important'), 'deploy card must be compact');
assert(css.includes('margin:7px auto 8px!important'), 'pre-footer spacing must be tightened');
assert(css.includes('color:#08285c!important;text-shadow:none!important'), 'footer text must be dark blue without shadow');
assert(app.includes('Project → Modules → Details → Deploy path'), 'guided description must reflect four-step flow');
console.log('PASS CPB Pass 12 consolidated polish');
