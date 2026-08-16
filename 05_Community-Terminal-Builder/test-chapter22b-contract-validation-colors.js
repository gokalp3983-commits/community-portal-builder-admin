const fs=require('fs');
const app=fs.readFileSync('public/app.js','utf8');
const css=fs.readFileSync('public/style.css','utf8');
function ok(cond,msg){if(!cond)throw new Error(msg)}
ok(app.includes('syncContractInputState'), 'shared contract input-state helper missing');
ok(app.includes('contract-state-wait') && app.includes('contract-state-pass') && app.includes('contract-state-fail'), 'contract state classes missing');
ok(app.includes('showContractCheck("wait","Enter a 42-character 0x contract address."'), 'token empty/wait state missing');
ok(app.includes('syncContractInputState(form.elements.nftContract,"wait")'), 'NFT empty state missing');
ok(app.includes('syncContractInputState(form.elements.nftContract,"fail")'), 'NFT invalid state missing');
ok(app.includes('syncContractInputState(form.elements.nftContract,"pass")'), 'NFT valid state missing');
ok(css.includes('.contract-check.wait') && css.includes('.contract-check.pass') && css.includes('.contract-check.fail'), 'status text colors missing');
ok(css.includes('input.contract-state-wait') && css.includes('input.contract-state-pass') && css.includes('input.contract-state-fail'), 'input border colors missing');
console.log('PASS CPB contract validation colors');
