const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');
const required = [
  '--rh-yellow:#ffd84d',
  '--pastel-violet:#a78bfa',
  '--pastel-cyan:#67e8f9',
  '--pastel-mint:#7ef0c5',
  'body.guided-mode .checks label:has(input:checked)',
  'background:linear-gradient(135deg,#ffe36f,#ffd23f)',
  'font-size:1.24rem',
  'body.guided-mode .checks strong{font-size:.84rem}',
  'body.guided-mode .checks small{font-size:.74rem'
];
for (const token of required) {
  if (!css.includes(token)) throw new Error(`Missing RC Pass 3 style token: ${token}`);
}
if (css.includes('body.advanced-mode{\n  --rh-yellow:')) {
  throw new Error('Pass 3 palette must remain Simplified-mode only.');
}
console.log('PASS: CTB Simplified v1 RC Pass 3 color and typography polish');
