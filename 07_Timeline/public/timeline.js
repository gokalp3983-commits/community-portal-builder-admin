"use strict";
const CFG=window.PROJECT_CONFIG,list=document.getElementById("timelineList");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function add(events,date,title,detail,type="MILESTONE",url=""){const ts=Date.parse(date||"");events.push({date:date||"",ts:Number.isFinite(ts)?ts:null,title,detail,type,url})}
function prettyDate(e){if(e.ts==null)return e.date||"DATE TBD";return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(e.ts));}
function build(){
  const events=[];
  for(const e of CFG.timeline?.events||[])add(events,e.date,e.title,e.detail,e.type||"COMMUNITY",e.url||"");
  const createdAt=CFG.timeline?.createdAt||CFG.generatedAt||"";
  if(createdAt)add(events,createdAt,`${CFG.project.name} Community Portal created`,`CPB generated the initial public Community Portal configuration.`,`PORTAL`);
  const moduleKeys=(CFG.moduleOrder&&CFG.moduleOrder.length)?CFG.moduleOrder:Object.keys(CFG.modules||{});
  const enabled=moduleKeys.filter(key=>CFG.modules?.[key]?.status==="READY").map(key=>CFG.modules[key].title).filter(Boolean);
  if(createdAt&&enabled.length)add(events,createdAt,`Portal modules activated`,enabled.join(" · "),"SYSTEM");
  const nft=CFG.nft||{};
  if(CFG.features?.nftTerminal&&CFG.contracts?.nft){
    if(nft.mode==="multiple"&&Array.isArray(nft.mintPhases)){for(const p of nft.mintPhases){add(events,p.startsAt,`${p.name||p.label} mint opens`,`${p.label||"NFT phase"} begins${p.price&&p.price!=="—"?` · ${p.price}`:""}${p.limit&&p.limit!=="—"?` · ${p.limit}`:""}.`,"NFT");add(events,p.endsAt,`${p.name||p.label} mint closes`,`${p.label||"NFT phase"} scheduled end.`,"NFT")}}
    else if(nft.mintAt)add(events,nft.mintAt,`${nft.collectionName||CFG.project.name+" NFT"} mint`,`Configured NFT mint launch time.`,`NFT`);
  }
  events.sort((a,b)=>a.ts==null?1:b.ts==null?-1:a.ts-b.ts);
  if(!events.length){list.innerHTML=`<div class="timeline-empty"><span>[ READY ]</span><strong>Community Timeline is active.</strong><small>Objective portal and project milestones will appear here as they become available.</small></div>`;return}
  list.innerHTML=events.map(e=>`<article class="timeline-event" data-type="${esc(String(e.type||"MILESTONE").toUpperCase())}"><div class="timeline-marker" aria-hidden="true">●</div><div class="timeline-event-body"><div class="timeline-meta"><span>${esc(String(e.type||"MILESTONE").toUpperCase())}</span><time>${esc(prettyDate(e))}</time></div><h3>${esc(e.title)}</h3><p>${esc(e.detail||"")}</p>${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Open source / announcement ↗</a>`:""}</div></article>`).join("");
}
if("scrollRestoration" in history)history.scrollRestoration="manual";
window.addEventListener("pageshow",()=>window.scrollTo(0,0));
const backToTop=document.getElementById("backToTop");if(backToTop){const sync=()=>backToTop.classList.toggle("visible",window.scrollY>420);window.addEventListener("scroll",sync,{passive:true});backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));sync();}
build();


/* CPB initial viewport lock: generated portals always open at the top. */
(() => {
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (_) {}
  const top = () => window.scrollTo(0, 0);
  const settle = () => { top(); requestAnimationFrame(() => requestAnimationFrame(top)); setTimeout(top, 120); setTimeout(top, 500); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", top, { once: true }); else top();
  window.addEventListener("pageshow", settle);
  window.addEventListener("load", settle, { once: true });
})();
