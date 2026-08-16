const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');
const checks = [
  ['deploy uses simple width', /#guided-deploy\{[\s\S]*?max-width:var\(--simple-width\)!important/],
  ['empty status removed', /#status:empty\{display:none!important;min-height:0!important;margin:0!important;padding:0!important\}/],
  ['builder bottom padding tightened', /#builder\{padding-bottom:8px!important\}/],
  ['prefooter aligned to simple width', /\.cpb-prefooter-energy\{[\s\S]*?var\(--simple-width\)/],
  ['footer shadow leakage disabled', /\.cpb-footer-copy \*[\s\S]*?text-shadow:none!important;[\s\S]*?filter:none!important/]
];
let failed = false;
for (const [name, rx] of checks) {
  const ok = rx.test(css);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
