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
const drop=normalizeDrop({status:"active",stages:[{name:"ALLOWLIST",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-20T12:00:00Z",price:0,max_mint_per_wallet:2},{name:"PUBLIC",start_time:"2026-08-20T12:00:00Z",end_time:"2026-08-22T12:00:00Z",price:"0.05",currency_symbol:"ETH",wallet_limit:5}]});
assert.equal(drop.stages.length,2);assert.equal(drop.stages[0].price,"FREE");assert.equal(drop.stages[1].price,"0.05 ETH");assert.equal(drop.stages[1].limit,"5");
const rotated=normalizeDrop({stages:[
  {name:"PHASE 3",start_time:"2026-08-23T10:00:00Z",end_time:"2026-08-24T10:00:00Z",price:"0.03"},
  {name:"PHASE 1",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-21T10:00:00Z",price:"0.01"},
  {name:"PHASE 2",start_time:"2026-08-21T10:00:00Z",end_time:"2026-08-22T10:00:00Z",price:"0.02"},
]});
assert.deepEqual(rotated.stages.map(s=>s.label),["PHASE 1","PHASE 2","PHASE 3"],"OpenSea stages must be ordered chronologically before filling CPB phases");
assert.ok(app.includes('for(const name of ["timeline","communityPulse"])setModuleState(name,{checked:false,disabled:true,state:"unavailable"})'),"NFT-only baseline must disable Timeline and Community Pulse");
assert.ok(app.includes('const target=input.value==="nft"?"#guided-nft-mint":"#guided-modules"'),"NFT-only baseline must jump directly to NFT Mint");
assert.ok(app.includes('checked:fresh?true:'),"Token + NFT fresh baseline must start with all optional modules enabled");
assert.ok(html.includes('id="check-opensea" class="cpb-action-button cpb-action-violet"'),"CHECK OPENSEA must use standard CPB action-button geometry");
assert.ok(html.includes('id="opensea-import-confirm-button" class="cpb-action-button cpb-action-green"'),"CONFIRM IMPORT must use standard CPB action-button geometry");
(async()=>{
  process.env.OPENSEA_API_KEY="test-key";
  const responses=[
    {ok:true,status:200, text:async()=>JSON.stringify({name:"Hoodrats",total_supply:2222,contracts:[{address:"0x1111111111111111111111111111111111111111",chain:"robinhood",contract_standard:"ERC721"}]})},
    {ok:true,status:200, text:async()=>JSON.stringify({status:"active",stages:[{name:"PUBLIC",start_time:"2026-08-20T10:00:00Z",end_time:"2026-08-21T10:00:00Z",price:0,max_mint_per_wallet:1}]})},
    {ok:true,status:200, text:async()=>JSON.stringify({symbol:"HOOD",contract_standard:"ERC721"})},
  ];
  const result=await importOpenSeaCollection("https://opensea.io/collection/hoodrats-nft/overview",{fetchImpl:async()=>responses.shift()});
  assert.equal(result.nft.collectionName,"Hoodrats");assert.equal(result.nft.supply,"2222");assert.equal(result.nft.drop.stages.length,1);assert.equal(result.nft.drop.stages[0].price,"FREE");
  console.log("PASS OpenSea NFT Mint auto-fill");
})().catch(err=>{console.error(err);process.exit(1)});
