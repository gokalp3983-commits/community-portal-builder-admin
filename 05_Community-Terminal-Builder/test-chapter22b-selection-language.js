const fs=require('fs');
const path=require('path');
const css=fs.readFileSync(path.join(__dirname,'public','style.css'),'utf8');
const marker='CPB RC Pass 11 — simplified selection language.';
if(!css.includes(marker)) throw new Error('Pass 11 selection CSS marker missing');
const tail=css.slice(css.indexOf(marker));
for(const required of [
  '.terminal-baseline-options input:checked::after',
  '.checks input:checked::after',
  '.terminal-baseline-options label:has(input:checked)::after',
  '.checks label[data-baseline-state="required"]::after',
  'content:none!important',
  'background:#ccff00',
  'background:rgb(var(--module-accent,204,255,0))'
]) if(!tail.includes(required)) throw new Error(`Missing selection contract: ${required}`);
console.log('PASS: CPB baseline/module selection uses filled squares only.');
