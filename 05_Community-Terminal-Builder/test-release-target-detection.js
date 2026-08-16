"use strict";
const fs=require("fs");
const path=require("path");
const {inspectReleaseTarget}=require("./connected-deploy");
function response(status,data){return {ok:status>=200&&status<300,status,async text(){return data===null?"":JSON.stringify(data)}}}
const env={CONNECTED_DEPLOYMENTS_ENABLED:"true",RELEASE_ACTIONS_ENABLED:"true",GITHUB_TOKEN:"gh-test",GITHUB_OWNER:"tester",RENDER_API_KEY:"rnd-test",RENDER_OWNER_ID:"tea-test"};
async function existingFetch(url){
  if(url.endsWith("/repos/tester/hoodrat-community-terminal"))return response(200,{html_url:"https://github.com/tester/hoodrat-community-terminal"});
  if(url.includes("api.render.com/v1/services?name=hoodrat-community-terminal"))return response(200,[{service:{id:"srv-hoodrat",name:"hoodrat-community-terminal",serviceDetails:{url:"https://hoodrat.onrender.com"}}}]);
  throw new Error(`Unexpected ${url}`);
}
async function newFetch(url){
  if(url.endsWith("/repos/tester/new-project-community-terminal"))return response(404,{message:"Not Found"});
  if(url.includes("api.render.com/v1/services?name=new-project-community-terminal"))return response(200,[]);
  throw new Error(`Unexpected ${url}`);
}
async function partialFetch(url){
  if(url.endsWith("/repos/tester/partial-community-terminal"))return response(200,{html_url:"https://github.com/tester/partial-community-terminal"});
  if(url.includes("api.render.com/v1/services?name=partial-community-terminal"))return response(200,[]);
  throw new Error(`Unexpected ${url}`);
}
(async()=>{
  const existing=await inspectReleaseTarget({repoName:"hoodrat-community-terminal",serviceName:"hoodrat-community-terminal"},{fetchImpl:existingFetch,env});
  if(existing.state!=="existing"||existing.suggestedReleaseMode!=="update"||existing.render.serviceId!=="srv-hoodrat")throw new Error("Existing release target was not detected as update.");
  const fresh=await inspectReleaseTarget({repoName:"new-project-community-terminal",serviceName:"new-project-community-terminal"},{fetchImpl:newFetch,env});
  if(fresh.state!=="new"||fresh.suggestedReleaseMode!=="create")throw new Error("Fresh release target was not detected as create.");
  const partial=await inspectReleaseTarget({repoName:"partial-community-terminal",serviceName:"partial-community-terminal"},{fetchImpl:partialFetch,env});
  if(partial.state!=="partial"||partial.suggestedReleaseMode!==null)throw new Error("Partial release target was not flagged for review.");
  const app=fs.readFileSync(path.join(__dirname,"public","app.js"),"utf8");
  if(!app.includes("/api/release-target-status")||!app.includes("UPDATE EXISTING RELEASE selected automatically"))throw new Error("Builder UI does not use server-side target auto-detection.");
  if(!app.includes("await showBuildComplete(project)"))throw new Error("Build completion does not await target auto-detection.");
  if(!app.includes("Generation failed (HTTP"))throw new Error("Generation errors are not resilient to non-JSON server responses.");
  console.log("[ PASS ] Existing GitHub + Render target auto-selects UPDATE EXISTING RELEASE");
  console.log("[ PASS ] New target auto-selects first deployment");
  console.log("[ PASS ] Partial target is flagged for review");
  console.log("[ PASS ] Non-JSON generation errors remain readable");
})().catch(error=>{console.error(`[ FAIL ] ${error.message}`);process.exit(1)});
