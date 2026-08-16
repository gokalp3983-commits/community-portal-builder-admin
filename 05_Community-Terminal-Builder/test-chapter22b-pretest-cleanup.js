const fs=require('fs');
const path=require('path');
const root=__dirname;
const html=fs.readFileSync(path.join(root,'public','index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'public','style.css'),'utf8');
const app=fs.readFileSync(path.join(root,'public','app.js'),'utf8');
function ok(condition,message){if(!condition){console.error('[ FAIL ]',message);process.exit(1)}console.log('[ PASS ]',message)}
ok(!html.includes('id="open-sea-slug-entry"'),'Deprecated Simplified OpenSea slug-only input removed');
ok(html.includes('<span>OpenSea collection link</span><input name="openSea" type="url"'),'Simplified mode uses the canonical full OpenSea URL field');
ok(html.includes('Paste the full OpenSea collection URL.'),'OpenSea helper text asks for the full collection link');
ok(!html.includes('guided-deploy-stage-head"><b>05</b>'),'Simplified Deploy no longer repeats stage 05 badge');
ok(css.includes('.panel[data-simple-stage]>.section-heading{display:none}'),'Legacy internal Builder section headings are hidden only in Simplified mode');
ok(!css.includes('.section-heading:before{content:attr(data-simple-stage)'), 'Orphaned internal stage-number pseudo boxes removed');
ok(app.includes('function syncOpenSeaSlug()'),'Canonical OpenSea URL still derives and stores the collection slug internally');
ok(!app.includes('applyGuidedOpenSeaSlug'),'Temporary slug-only RC translation code removed');
ok(!app.includes('syncGuidedOpenSeaEntryFromUrl'),'Temporary slug-only hydration code removed');
console.log('Chapter 22B pre-test cleanup regression: PASS');
