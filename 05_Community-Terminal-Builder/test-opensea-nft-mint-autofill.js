"use strict";
const assert=require("assert"),fs=require("fs"),path=require("path");
const {parseOpenSeaCollectionUrl,normalizeDrop,importOpenSeaCollection}=require("./opensea-import");
const html=fs.readFileSync(path.join(__dirname,"public/index.html"),"utf8");
const app=fs.readFileSync(path.join(__dirname,"public/app.js"),"utf8");
assert.equal(parseOpenSeaCollectionUrl("https://opensea.io/collection/hoodrats-nft/overview").slug,"hoodrats-nft");
assert.ok(html.indexOf('id="check-opensea"')>html.indexOf('id="guided-nft-mint"'),"CHECK OPENSEA belongs inside NFT Mint module");
assert.ok(html.indexOf('name="openSea"')>html.indexOf('id="guided-nft-mint"'),"OpenSea URL belongs inside NFT Mint module");
assert.ok(html.indexOf('name="nftContract"')>html.indexOf('id="guided-nft-mint"'),"Editable NFT CA belongs inside NFT Mint module");
assert.ok(html.includes('id="nft-contract-mirror"')&&html.includes('readonly'),"Contracts NFT CA must be a readonly mirror");
assert.equal((html.match(/name="nftContract"/g)||[]).length,1,"There must be one editable/source NFT contract field");
assert.ok(app.includes("applyOpenSeaMintSchedule")&&app.includes('setValue("nftMintMode","multiple")'),"OpenSea stages should auto-select mint structure");
assert.ok(app.includes("renderOpenSeaImportConfirmation"),"Successful auto-fill must show confirmation dialog");
const drop=normalizeDrop({status:"active",stages:[{stage_type:"allowlist",name:"Team",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-20T12:00:00Z",price:0,max_mint_per_wallet:2},{stage_type:"public",name:"Public Mint",start_time:"2026-08-20T12:00:00Z",end_time:"2026-08-22T12:00:00Z",price:"0.05",currency_symbol:"ETH",wallet_limit:5}]});
assert.equal(drop.stages.length,2);assert.equal(drop.stages[0].label,"ALLOWLIST");assert.equal(drop.stages[0].name,"Team");assert.equal(drop.stages[0].price,"FREE");assert.equal(drop.stages[1].label,"PUBLIC");assert.equal(drop.stages[1].name,"Public Mint");assert.equal(drop.stages[1].price,"0.05 ETH");assert.equal(drop.stages[1].limit,"5");
const noSupplyLeak=normalizeDrop({stages:[{stage_type:"allowlist",name:"Community",max_mintable:2222,max_mint_per_wallet:1}]});
assert.equal(noSupplyLeak.stages[0].limit,"1","Per-wallet limit must win over collection/stage max supply");
const supplyOnly=normalizeDrop({stages:[{stage_type:"allowlist",name:"Community",max_mintable:2222}]});
assert.equal(supplyOnly.stages[0].limit,null,"Collection/stage max supply must never become wallet limit");
const rotated=normalizeDrop({stages:[
  {name:"PHASE 3",start_time:"2026-08-23T10:00:00Z",end_time:"2026-08-24T10:00:00Z",price:"0.03"},
  {name:"PHASE 1",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-21T10:00:00Z",price:"0.01"},
  {name:"PHASE 2",start_time:"2026-08-21T10:00:00Z",end_time:"2026-08-22T10:00:00Z",price:"0.02"},
]});
assert.deepEqual(rotated.stages.map(s=>s.label),["PHASE 1","PHASE 2","PHASE 3"],"OpenSea stages must be ordered chronologically before filling CPB phases");
assert.ok(app.includes('for(const name of ["timeline","communityPulse"])setModuleState(name,{checked:false,disabled:true,state:"unavailable"})'),"NFT-only baseline must disable Timeline and Community Pulse");
assert.ok(app.includes('const target=input.value==="nft"?"#nft-opensea-autofill":"#guided-modules"'),"NFT-only baseline must jump directly to OpenSea entry");
assert.ok(app.includes('checked:fresh?true:'),"Token + NFT fresh baseline must start with all optional modules enabled");
assert.ok(app.includes('setTerminalBaseline("");\nbaselineSelectionHandled=false;\nsyncTerminalBaseline();'),"Builder reload/start must clear baseline selection");
assert.ok(html.includes('id="check-opensea" class="cpb-action-button cpb-action-violet"'),"CHECK OPENSEA must use standard CPB action-button geometry");
assert.ok(html.includes('id="opensea-import-confirm-button" class="cpb-action-button cpb-action-green"'),"CONFIRM IMPORT must use standard CPB action-button geometry");

assert.ok(app.includes('if(terminalBaseline()==="nft"&&nft.collectionName)'),"NFT-only OpenSea import must mirror NFT collection identity into Project Details");
assert.ok(app.includes('setValue("projectName",nftProjectName)'),"NFT-only import must fill Project Name from NFT Mint collection name");
assert.ok(app.includes('setValue("description",`${nftProjectName} NFT Collection Portal`)'),"NFT-only import must synthesize NFT Collection Portal description");
assert.ok(app.includes('replace(/[^a-z0-9]+/gi,"").toUpperCase()'),"NFT-only internal ticker must derive from OpenSea slug");

const completed=normalizeDrop({status:"active",stages:[{stage_type:"allowlist",name:"Team",end_time:"2026-08-10T12:00:00Z"},{stage_type:"public",name:"Public",end_time:"2026-08-11T12:00:00Z"}]},Date.parse("2026-08-16T12:00:00Z"));
assert.equal(completed.mintComplete,true,"All historical phases must mark mint complete");
const ongoing=normalizeDrop({status:"active",stages:[{stage_type:"public",name:"Public",end_time:"2026-08-20T12:00:00Z"}]},Date.parse("2026-08-16T12:00:00Z"));
assert.equal(ongoing.mintComplete,false,"Future phase end must keep mint active");
assert.ok(app.includes('if(drop.mintComplete)'),"Completed mint must auto-select Portal Only before phase setup");
assert.ok(app.includes('applyOpenSeaLinks'),"OpenSea social links must auto-fill existing CPB link fields");
assert.ok(app.includes('for(const [label,value] of Object.entries(importedLinks||{}))'),"Imported social links must be shown in confirmation summary");
assert.ok(app.includes('form.elements.openSea?.focus({preventScroll:true})'),"NFT-only selection must focus OpenSea link entry");
assert.ok(app.includes('form.elements.nftContract?.classList.remove("contract-state-wait","contract-state-pass","contract-state-fail")'),"NFT CA must remain visually neutral before OpenSea import");
assert.ok(app.includes('window.addEventListener("beforeunload"'),"In-progress work must warn before accidental refresh/navigation");
assert.ok(!app.includes('const recoverAfterReload='),"Confirmed refresh must not restore in-progress draft");

assert.ok(app.includes('closeOpenSeaImportConfirmation({confirmImport=false}={})'),"OpenSea confirmation must distinguish confirm from close/cancel");
assert.ok(app.includes('confirmedMintSignature=schedule.mode==="terminal"?"":mintSignature(schedule)'),"CONFIRM IMPORT must satisfy the NFT mint confirmation requirement for imported schedules");
assert.ok(app.includes('()=>closeOpenSeaImportConfirmation({confirmImport:true})'),"CONFIRM IMPORT button must record confirmation before closing");
assert.ok(app.indexOf('if(!await confirmMascotOptionalReminder())')>app.indexOf('if(schedule.mode!=="terminal"&&confirmedMintSignature!==mintSignature(schedule))'),"Mascot reminder must run only after NFT validation succeeds");
assert.ok(html.includes('Selecting a mascot/logo is not mandatory.'),"Mascot reminder must explicitly state that logo selection is not mandatory");
(async()=>{
  process.env.OPENSEA_API_KEY="test-key";
  const responses=[
    {ok:true,status:200, text:async()=>JSON.stringify({name:"Hoodrats",total_supply:2222,external_url:"https://hoodrats.example",twitter_username:"hoodrat_coin",telegram_url:"https://t.me/hoodrats",discord_url:"https://discord.gg/hoodrats",instagram_username:"hoodrats",contracts:[{address:"0x1111111111111111111111111111111111111111",chain:"robinhood",contract_standard:"ERC721"}]})},
    {ok:true,status:200, text:async()=>JSON.stringify({status:"active",stages:[{name:"PUBLIC",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-21T10:00:00Z",price:0,max_mint_per_wallet:1}]})},
    {ok:true,status:200, text:async()=>JSON.stringify({symbol:"HOOD",contract_standard:"ERC721"})},
  ];
  const result=await importOpenSeaCollection("https://opensea.io/collection/hoodrats-nft/overview",{fetchImpl:async()=>responses.shift()});
  assert.equal(result.nft.collectionName,"Hoodrats");assert.equal(result.nft.supply,"2222");assert.equal(result.nft.links.website,"https://hoodrats.example");assert.equal(result.nft.links.x,"https://x.com/hoodrat_coin");assert.equal(result.nft.links.telegram,"https://t.me/hoodrats");assert.ok(result.nft.links.additionalLinks.some(x=>x.label==="DISCORD"));assert.equal(result.nft.drop.stages.length,1);assert.equal(result.nft.drop.stages[0].price,"FREE");
  console.log("PASS OpenSea NFT Mint auto-fill");
})().catch(err=>{console.error(err);process.exit(1)});
