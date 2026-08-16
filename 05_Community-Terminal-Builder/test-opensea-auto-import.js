"use strict";
const assert = require("assert");
const { parseOpenSeaCollectionUrl, normalizeCollection, importOpenSeaCollection } = require("./opensea-import");

const parsed = parseOpenSeaCollectionUrl("https://opensea.io/collection/hoodrats-nft/overview");
assert.equal(parsed.slug, "hoodrats-nft");
assert.equal(parsed.url, "https://opensea.io/collection/hoodrats-nft");
assert.throws(() => parseOpenSeaCollectionUrl("https://example.com/collection/hoodrats-nft"), /opensea\.io/i);

const normalized = normalizeCollection({
  name: "Hoodrats",
  description: "Hoodrat collection",
  total_supply: 2222,
  image_url: "https://i.seadn.io/example.png",
  twitter_username: "hoodrat",
  external_url: "https://example.org",
  contracts: [{ address: "0x1111111111111111111111111111111111111111", chain: "robinhood" }],
}, parsed, { symbol: "HOODRAT", contract_standard: "ERC721" });
assert.equal(normalized.collectionName, "Hoodrats");
assert.equal(normalized.supply, "2222");
assert.equal(normalized.contractAddress, "0x1111111111111111111111111111111111111111");
assert.equal(normalized.links.x, "https://x.com/hoodrat");
assert.equal(normalized.symbol, "HOODRAT");

(async()=>{
  const prior = process.env.OPENSEA_API_KEY;
  process.env.OPENSEA_API_KEY = "test-key";
  const calls=[];
  const fetchImpl=async(url,options={})=>{
    calls.push({url:String(url),headers:options.headers||{}});
    if(String(url).includes("/collections/hoodrats-nft")) return new Response(JSON.stringify({
      name:"Hoodrats",description:"Hoodrat collection",total_supply:2222,
      contracts:[{address:"0x1111111111111111111111111111111111111111",chain:"robinhood"}],
      twitter_username:"hoodrat",external_url:"https://example.org"
    }),{status:200,headers:{"content-type":"application/json"}});
    if(String(url).includes("/chain/robinhood/contract/")) return new Response(JSON.stringify({symbol:"HOODRAT",contract_standard:"ERC721"}),{status:200,headers:{"content-type":"application/json"}});
    throw new Error(`Unexpected URL ${url}`);
  };
  const result=await importOpenSeaCollection("https://opensea.io/collection/hoodrats-nft/overview",{fetchImpl});
  assert.equal(result.ok,true);
  assert.equal(result.nft.symbol,"HOODRAT");
  assert.equal(result.apiKeyMode,"configured");
  assert.ok(calls.every(call=>call.headers["x-api-key"]==="test-key"));
  if(prior===undefined)delete process.env.OPENSEA_API_KEY;else process.env.OPENSEA_API_KEY=prior;
  console.log("OpenSea auto-import tests passed.");
})().catch(error=>{console.error(error);process.exit(1)});
