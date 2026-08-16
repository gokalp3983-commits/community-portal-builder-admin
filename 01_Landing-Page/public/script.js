"use strict";

let CONFIG;
let MODULES;
let MARKET_REFRESH_MS = 30_000;
let hasMarketData = false;
const FALLBACK_MODULE_ORDER = ["whales", "intel", "nft", "pulse", "timeline"];

const boot = document.getElementById("boot");
const output = document.getElementById("output");
const marketPanel = document.getElementById("marketPanel");
const marketPriceStatus = document.getElementById("marketPriceStatus");
const marketCapStatus = document.getElementById("marketCapStatus");
const marketHoldersStatus = document.getElementById("marketHoldersStatus");
const marketVolumeStatus = document.getElementById("marketVolumeStatus");
const marketUpdatedStatus = document.getElementById("marketUpdatedStatus");
const marketPrice = document.getElementById("marketPrice");
const marketPriceChange = document.getElementById("marketPriceChange");
const marketCap = document.getElementById("marketCap");
const marketHolders = document.getElementById("marketHolders");
const marketVolume = document.getElementById("marketVolume");
const marketUpdated = document.getElementById("marketUpdated");
const tokenContractValue = document.querySelector("[data-token-contract]");
const copyTokenContract = document.querySelector("[data-copy-token-contract]");

const backToTopButton = document.getElementById("backToTop");

// Always open the portal at the top after a reload/navigation restore.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const resetInitialPortalScroll = () => window.scrollTo(0, 0);
resetInitialPortalScroll();
document.addEventListener("DOMContentLoaded", resetInitialPortalScroll, { once: true });
window.addEventListener("pageshow", () => {
  resetInitialPortalScroll();
  requestAnimationFrame(() => requestAnimationFrame(resetInitialPortalScroll));
  setTimeout(resetInitialPortalScroll, 120);
  setTimeout(resetInitialPortalScroll, 500);
});
window.addEventListener("load", () => {
  requestAnimationFrame(() => requestAnimationFrame(resetInitialPortalScroll));
  setTimeout(resetInitialPortalScroll, 120);
  setTimeout(resetInitialPortalScroll, 500);
}, { once: true });

function syncBackToTop() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle("visible", window.scrollY > 420);
}

backToTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", syncBackToTop, { passive: true });
syncBackToTop();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function write(target, html) {
  const line = document.createElement("div");
  line.className = "line";
  line.innerHTML = html;
  target.appendChild(line);
}

async function loadConfig() {
  const response = await fetch("/api/config", { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error("Project configuration is unavailable.");
  return response.json();
}

function applyTheme(colors) {
  const root = document.documentElement;
  const map = {
    background: "--bg", panel: "--panel", green: "--green", yellow: "--yellow",
    cyan: "--cyan", blue: "--blue", orange: "--orange", red: "--red",
    muted: "--muted", line: "--line",
  };
  for (const [key, cssVariable] of Object.entries(map)) {
    if (colors[key]) root.style.setProperty(cssVariable, colors[key]);
  }
}

function setupTokenContract(){const address=CONFIG?.contracts?.token||"";if(tokenContractValue)tokenContractValue.textContent=address||"NOT SET";if(copyTokenContract){copyTokenContract.addEventListener("click",async()=>{if(!address)return;try{await navigator.clipboard.writeText(address);copyTokenContract.textContent="✓";setTimeout(()=>copyTokenContract.textContent="⧉",900)}catch{tokenContractValue?.focus?.()}})}}

function renderModules() {
  const explanations = document.getElementById("modulesList");
  explanations.innerHTML = "";

  const moduleOrder = Array.isArray(CONFIG?.moduleOrder) ? CONFIG.moduleOrder : FALLBACK_MODULE_ORDER;
  for (const key of moduleOrder) {
    const module = MODULES[key];
    if (!module) continue;

    const row = document.createElement("div");
    row.className = "module-explanation module-launch-row";
    row.dataset.module = key;

    const button = document.createElement("button");
    button.className = "module-launch-button";
    button.type = "button";
    button.textContent = module.command.toUpperCase();
    button.setAttribute("aria-label", `Open ${module.title}`);
    button.addEventListener("click", () => window.open(module.url, "_blank", "noopener"));

    const title = document.createElement("span");
    title.className = "module-explanation-title";
    title.textContent = module.title;

    const copy = document.createElement("span");
    copy.className = "module-explanation-copy";
    copy.textContent = module.description;

    row.append(button, title, copy);
    explanations.appendChild(row);
  }
}



async function normalizeMascotBackground(image) {
  if (!image || !image.src) return;
  try {
    if (!image.complete) await new Promise((resolve, reject) => {
      image.addEventListener("load", resolve, { once:true });
      image.addEventListener("error", reject, { once:true });
    });
    const nw=image.naturalWidth||0, nh=image.naturalHeight||0;
    if (!nw || !nh) return;
    const max=512, scale=Math.min(1,max/Math.max(nw,nh));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(nw*scale)); canvas.height=Math.max(1,Math.round(nh*scale));
    const ctx=canvas.getContext("2d",{alpha:true,willReadFrequently:true});
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const frame=ctx.getImageData(0,0,canvas.width,canvas.height), d=frame.data, w=canvas.width, h=canvas.height;
    const samples=[]; const stepX=Math.max(1,Math.floor(w/28)), stepY=Math.max(1,Math.floor(h/28));
    const take=(x,y)=>{const i=(y*w+x)*4;samples.push([d[i],d[i+1],d[i+2],d[i+3]])};
    for(let x=0;x<w;x+=stepX){take(x,0);take(x,h-1)} for(let y=0;y<h;y+=stepY){take(0,y);take(w-1,y)}
    if(!samples.length) return;
    const opaque=samples.filter(p=>p[3]>235); if(opaque.length<samples.length*.72) return; // already transparent/complex edge
    const bg=[0,1,2].map(c=>Math.round(opaque.reduce((s,p)=>s+p[c],0)/opaque.length));
    const spread=opaque.reduce((s,p)=>s+Math.hypot(p[0]-bg[0],p[1]-bg[1],p[2]-bg[2]),0)/opaque.length;
    if(spread>68) return; // avoid stripping artwork that genuinely occupies the frame edge
    const tolerance=52, soft=24, visited=new Uint8Array(w*h), queue=[];
    const distanceAt=(x,y)=>{const i=(y*w+x)*4;return Math.hypot(d[i]-bg[0],d[i+1]-bg[1],d[i+2]-bg[2])};
    const push=(x,y)=>{if(x<0||y<0||x>=w||y>=h)return;const n=y*w+x;if(visited[n]||distanceAt(x,y)>tolerance+soft)return;visited[n]=1;queue.push(n)};
    for(let x=0;x<w;x++){push(x,0);push(x,h-1)} for(let y=0;y<h;y++){push(0,y);push(w-1,y)}
    if(queue.length < Math.max(8,(w+h)*.05)) return;
    for(let q=0;q<queue.length;q++){const n=queue[q],x=n%w,y=Math.floor(n/w),i=n*4,dist=distanceAt(x,y);d[i+3]=dist<=tolerance?0:Math.round(255*(dist-tolerance)/soft);push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1)}
    ctx.putImageData(frame,0,0); image.src=canvas.toDataURL("image/png");
  } catch (_) { /* Preserve the original mascot if canvas processing is unavailable. */ }
}

function applyConfig() {
  const { project, branding, links } = CONFIG;
  const title = `${project.name} Community Portal`;
  document.title = title;
  document.getElementById("pageDescription").content = `${title} — ${project.description}`;
  document.getElementById("themeColor").content = branding.themeColor;
  document.getElementById("terminalShell").setAttribute("aria-label", title);
  const homeLink = document.getElementById("homeLink");
  homeLink.href = "/";
  homeLink.title = `Return to ${title}`;
  if (!homeLink.dataset.homeConfirmBound) {
    homeLink.addEventListener("click", (event) => {
      if (!window.confirm("Return to the main Community Terminal landing page?")) event.preventDefault();
    });
    homeLink.dataset.homeConfirmBound = "true";
  }
  const mascotImage = document.getElementById("mascot");
  mascotImage.src = branding.mascot;
  mascotImage.alt = branding.mascotAlt;
  normalizeMascotBackground(mascotImage);
  document.getElementById("terminalTitle").textContent = title.toUpperCase();
  document.getElementById("terminalSubtitle").innerHTML = `Independent Community Tools <span aria-hidden="true">•</span> ${escapeHtml(project.ecosystem)} Ecosystem`;
  document.getElementById("marketPanel").setAttribute("aria-label", `Live ${project.name} market data`);
  // The generated canonical-footer runtime exclusively owns footer markup.
  // Do not touch #footerCopy here: it may already have been replaced while /api/config was loading.
  applyTheme(branding.colors || {});
  setupTokenContract();
  renderModules();
}

async function getLiveMarket({ attempts = 1 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch("/api/price", { headers: { Accept: "application/json" }, cache: "no-store" });
      const data = await response.json();
      if (response.ok && data.available) return data;
      const error = new Error(data.error || "Live market data unavailable.");
      error.code = data.code || "DATA_SOURCE_UNAVAILABLE";
      lastError = error;
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await sleep(500 * attempt);
  }
  throw lastError || new Error("Live market data unavailable.");
}

function formatWidgetTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatUsdPrice(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value ?? "—");
  return numeric.toFixed(5);
}

function setMarketStatus(text, state = "") {
  for (const element of [marketPriceStatus, marketCapStatus, marketHoldersStatus, marketVolumeStatus, marketUpdatedStatus]) {
    element.textContent = `[ ${text} ]`;
    element.classList.toggle("error", state === "error");
  }
}

async function refreshMarketWidget() {
  setMarketStatus(hasMarketData ? "REFRESHING" : "CONNECTING");
  try {
    const market = await getLiveMarket({ attempts: hasMarketData ? 1 : 4 });
    marketPrice.textContent = `$${formatUsdPrice(market.priceUsd)} USD / ${market.priceQuote} ${market.quoteSymbol || "QUOTE"}`;
    const priceChange = Number(market.priceChange24h);
    if (marketPriceChange) {
      const validChange = Number.isFinite(priceChange);
      const arrow = validChange ? (priceChange > 0 ? "▲" : priceChange < 0 ? "▼" : "•") : "";
      const changeLabel = window.matchMedia("(max-width: 600px)").matches ? "24H CHANGE" : "24H PRICE CHANGE";
      marketPriceChange.textContent = validChange
        ? `${changeLabel}  ${arrow} ${priceChange > 0 ? "+" : ""}${priceChange.toFixed(2)}%`
        : `${changeLabel}  —`;
      marketPriceChange.classList.toggle("positive", validChange && priceChange > 0);
      marketPriceChange.classList.toggle("negative", validChange && priceChange < 0);
      marketPriceChange.classList.toggle("neutral", !validChange || priceChange === 0);
    }
    marketCap.textContent = market.marketCapDisplay || "NO MARKET CAP DATA";
    marketHolders.textContent = market.holdersDisplay || "NO HOLDER DATA";
    marketVolume.textContent = market.volume24hDisplay || "NO VOLUME DATA";
    marketUpdated.textContent = formatWidgetTime(new Date());
    setMarketStatus("LIVE");
    hasMarketData = true;
  } catch (error) {
    const reason = String(error && error.message || "DATA SOURCE UNAVAILABLE").toUpperCase();
    setMarketStatus(reason, "error");
    if (!hasMarketData) {
      marketPrice.textContent = reason;
      if (marketPriceChange) {
        const changeLabel = window.matchMedia("(max-width: 600px)").matches ? "24H CHANGE" : "24H PRICE CHANGE";
        marketPriceChange.textContent = `${changeLabel}  —`;
        marketPriceChange.className = "market-price-change neutral";
      }
      marketCap.textContent = reason;
      marketHolders.textContent = reason;
      marketVolume.textContent = reason;
      marketUpdated.textContent = "—";
    }
  }
}

async function bootSequence() {
  const sequence = Object.values(MODULES)
    .filter((module) => String(module.status || "").trim().toUpperCase() === "READY")
    .map((module) => [`[ <span class="green">READY</span> ] ${escapeHtml(module.title)}`, 180]);
  boot.innerHTML = "";
  for (const [line, delay] of sequence) {
    await sleep(delay);
    write(boot, line);
  }
}

async function start() {
  try {
    CONFIG = await loadConfig();
    const featureForModule = {
      whales: "whaleTracker",
      intel: "memeIntel",
      pulse: "communityPulse",
      timeline: "timeline",
      nft: "nftTerminal",
    };
    MODULES = Object.fromEntries(
      (Array.isArray(CONFIG?.moduleOrder) ? CONFIG.moduleOrder : FALLBACK_MODULE_ORDER)
        .filter((key) => CONFIG.modules?.[key])
        .filter((key) => CONFIG.features?.[featureForModule[key]] !== false)
        .map((key) => [key, { ...CONFIG.modules[key], url: CONFIG.links.modules[key] }])
    );
    MARKET_REFRESH_MS = Number(CONFIG.market?.refreshMs) || 30_000;
    applyConfig();
    if (CONFIG.features.liveMarket) {
      refreshMarketWidget();
      setInterval(refreshMarketWidget, MARKET_REFRESH_MS);
    } else {
      marketPanel.hidden = true;
    }
    await bootSequence();
  } catch (error) {
    console.error(error);
    write(boot, '<span class="red">[ CONFIG ERROR ] Unable to load project configuration.</span>');
  }
}

start();
