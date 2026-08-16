"use strict";

const CFG = window.PROJECT_CONFIG || {};
const PROJECT_NAME = CFG.project?.name || "NFT";
const MINT_AT = new Date(CFG.nft?.mintAt || "2026-08-07T19:00:00+03:00");
const configuredMintEnd = CFG.nft?.mintEndAt ? new Date(CFG.nft.mintEndAt) : null;
const MINT_END_AT = configuredMintEnd && Number.isFinite(configuredMintEnd.getTime())
  ? configuredMintEnd
  : null;
const $ = (id) => document.getElementById(id);
let liveAnnounced = false;
let completeAnnounced = false;
let mintComplete = false;
let completionCheckStarted = false;

function responsiveStatusCopy(desktopText, mobileText){
  return `<span class="log-copy-desktop">${desktopText}</span><span class="log-copy-mobile">${mobileText}</span>`;
}

function pad(v){ return String(Math.max(0,v)).padStart(2,"0"); }
function isMintLive(){ return Date.now() >= MINT_AT.getTime(); }
function scheduledMintComplete(){ return Boolean(MINT_END_AT && Date.now() >= MINT_END_AT.getTime()); }
function phaseTimeText(iso){
  const raw=String(iso||"");
  if(!raw)return "—";
  const date=new Date(raw);
  if(!Number.isFinite(date.getTime()))return "—";
  return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false,timeZoneName:"short"}).format(date).replace(",","");
}
function singlePhaseInfo(){
  const start=phaseTimeText(CFG.nft?.mintAt);
  const end=phaseTimeText(CFG.nft?.mintEndAt);
  const price=String(CFG.nft?.mintPrice||"—");
  const limit=String(CFG.nft?.mintLimit||"—");
  return `Phase 1 · ${start}${end!=="—"?`–${end}`:""} · Mint ${price} · Wallet limit ${limit}`;
}


function hideCountdownArea(){
  const countdownArea = document.querySelector(".countdown-area");
  if (countdownArea) countdownArea.hidden = true;
}

function showTerminalLine(){
  const terminalLine = $("postMintTerminalLine");
  if (terminalLine) terminalLine.hidden = false;
}

function setComplete(){
  mintComplete = true;
  const livePanel = $("launchLivePanel");
  if (livePanel) {
    livePanel.hidden = false;
    livePanel.innerHTML = `
      <div class="countdown-box post-mint-live-box post-mint-complete-box">
        <div class="countdown-label">[ MINT COMPLETE ]</div>
        <div class="countdown-value">MINT COMPLETE</div>
        <div class="countdown-phase-info">${singlePhaseInfo()}</div>
        <div class="countdown-prompt"><span class="green">&gt;</span> NFT Portal is tracking post-mint collection activity <span class="cursor">█</span></div>
      </div>`;
  }

  hideCountdownArea();
  showTerminalLine();

  if ($("mintCommand")) {
    $("mintCommand").innerHTML = `<span class="green">[ COMPLETE ]</span> ${responsiveStatusCopy(`${PROJECT_NAME} mint schedule has concluded.`, "Mint complete.")}`;
  }
  if ($("mintReady")) {
    $("mintReady").innerHTML = `<span class="green">[ READY ]</span> ${responsiveStatusCopy("NFT Portal is tracking collection activity.", "Tracking active.")}`;
  }

  // Phased variants can mark their command rows with data-mint-phase-row.
  // This keeps the base compatible with multi-phase launch pages without
  // requiring the standard single-countdown page to add new phase UI.
  document.querySelectorAll("[data-mint-phase-row]").forEach((row, index) => {
    const label = row.getAttribute("data-phase-label") || `Phase-${index + 1}`;
    row.innerHTML = `<span class="green">[ ✓ ]</span> ${label} : COMPLETE`;
  });

  // Completion supersedes the generic live announcement, including the modal.
  const lifecycleModal = $("mintLiveModal");
  if (lifecycleModal) {
    const tag = lifecycleModal.querySelector(".modal-tag");
    const title = $("mintLiveTitle");
    const copy = lifecycleModal.querySelector("p");
    if (tag) {
      tag.textContent = "[ MINT COMPLETE ]";
      tag.classList.add("live-tag");
    }
    if (title) title.textContent = `THE ${PROJECT_NAME.toUpperCase()} MINT IS COMPLETE`;
    if (copy) copy.textContent = "The mint schedule has concluded. Visit the NFT Portal for collection activity or view the collection on OpenSea.";
    if (!completeAnnounced) {
      completeAnnounced = true;
      lifecycleModal.hidden = false;
    }
  }
}

function setLive(){
  if (mintComplete || scheduledMintComplete()) {
    setComplete();
    return;
  }

  const lifecycleModal = $("mintLiveModal");
  if (lifecycleModal) {
    const tag = lifecycleModal.querySelector(".modal-tag");
    const title = $("mintLiveTitle");
    const copy = lifecycleModal.querySelector("p");
    if (tag) {
      tag.textContent = "[ MINT LIVE ]";
      tag.classList.add("live-tag");
    }
    if (title) title.textContent = `THE ${PROJECT_NAME.toUpperCase()} MINT HAS STARTED`;
    if (copy) copy.textContent = "The mint is now live. Visit the NFT Portal for live activity or view the collection on OpenSea.";
  }

  const livePanel = $("launchLivePanel");
  if (livePanel) {
    livePanel.hidden = false;
    livePanel.innerHTML = `
      <div class="countdown-box post-mint-live-box">
        <div class="countdown-label">[ MINT LIVE ]</div>
        <div class="countdown-value">MINT LIVE</div>
        <div class="countdown-prompt"><span class="green">&gt;</span> enter the NFT Portal for live mint and collection activity <span class="cursor">█</span></div>
      </div>`;
  }

  hideCountdownArea();
  showTerminalLine();

  if ($("mintCommand")) {
    $("mintCommand").innerHTML = `<span class="green">[ LIVE ]</span> ${responsiveStatusCopy(`${PROJECT_NAME} mint is active.`, "Mint active.")}`;
  }
  if ($("mintReady")) {
    $("mintReady").innerHTML = `<span class="green">[ READY ]</span> ${responsiveStatusCopy("NFT Portal is the live collection dashboard.", "Live dashboard ready.")}`;
  }

  if (!liveAnnounced){
    liveAnnounced = true;
    if ($("mintLiveModal")) $("mintLiveModal").hidden = false;
  }
}

async function checkOnChainCompletion(){
  if (!isMintLive() || mintComplete) return;
  if (scheduledMintComplete()) {
    setComplete();
    return;
  }

  try {
    const response = await fetch("/api/mint-stats", { headers: { Accept: "application/json" } });
    const data = await response.json();
    const minted = Number(data?.minted);
    const supply = Number(data?.supply ?? CFG.nft?.supply);
    if (Number.isFinite(minted) && Number.isFinite(supply) && supply > 0 && minted >= supply) {
      setComplete();
    }
  } catch (_) {
    // Landing-page completion detection is additive only; terminal/API behavior
    // remains untouched if the status request is temporarily unavailable.
  }
}

function startCompletionChecks(){
  if (completionCheckStarted) return;
  completionCheckStarted = true;
  checkOnChainCompletion();
  setInterval(checkOnChainCompletion, 15000);
}

function tick(){
  if (scheduledMintComplete()) {
    setComplete();
    return;
  }

  const left = MINT_AT.getTime() - Date.now();
  if (left <= 0){
    setLive();
    startCompletionChecks();
    return;
  }

  const total = Math.floor(left / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const clock = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  const display = days > 0 ? `${pad(days)}D:${clock}` : clock;

  if ($("countdownValue")) $("countdownValue").textContent = display;
  if ($("inlineCountdownValue")) $("inlineCountdownValue").textContent = display;
}

if ($("terminalLink")) {
  $("terminalLink").addEventListener("click", (event) => {
    if (!isMintLive()) {
      event.preventDefault();
      if ($("preMintModal")) $("preMintModal").hidden = false;
    }
  });
}

if ($("preMintCancel")) $("preMintCancel").addEventListener("click",()=>{ $("preMintModal").hidden = true; });
if ($("mintLiveClose")) $("mintLiveClose").addEventListener("click",()=>{ $("mintLiveModal").hidden = true; });

tick();
setInterval(tick,1000);

// CPB shared portal navigation behavior: always begin at top and expose the shared back-to-top control.
(function setupPortalScrollBehavior(){
  try{ if("scrollRestoration" in history) history.scrollRestoration="manual"; }catch(_){ }
  const resetTop=()=>window.scrollTo(0,0);
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",resetTop,{once:true}); else resetTop();
  window.addEventListener("load",()=>setTimeout(resetTop,0),{once:true});
  const bind=()=>{
    const button=document.getElementById("backToTop"); if(!button)return;
    const sync=()=>button.classList.toggle("visible",window.scrollY>420);
    window.addEventListener("scroll",sync,{passive:true}); sync();
    button.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  };
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind,{once:true}); else bind();
})();


/* CPB final initial viewport lock */
(() => {
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (_) {}
  const top = () => window.scrollTo(0, 0);
  const settle = () => { top(); requestAnimationFrame(() => requestAnimationFrame(top)); setTimeout(top, 120); setTimeout(top, 500); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", top, { once: true }); else top();
  window.addEventListener("pageshow", settle);
  window.addEventListener("load", settle, { once: true });
})();
