const fs=require('fs');
const html=fs.readFileSync('05_Community-Terminal-Builder/public/index.html','utf8');
const app=fs.readFileSync('05_Community-Terminal-Builder/public/app.js','utf8');
const gen=fs.readFileSync('05_Community-Terminal-Builder/generator.js','utf8');
function ok(name,cond){if(!cond)throw new Error(name);console.log('[ PASS ]',name)}
ok('CPB footer avatar hard-sized inline',html.includes('width:56px;height:56px;min-width:56px;max-width:56px'));
ok('Preview footer avatar hard-sized inline',app.includes('preview-footer-avatar')&&app.includes('min-width:56px;max-width:56px'));
ok('Generated landing footer avatar hard-sized inline',gen.includes('cpb-portal-footer-avatar')&&gen.includes('min-width:56px;max-width:56px'));
console.log('Pass 12.18 avatar hard-size checks passed.');
