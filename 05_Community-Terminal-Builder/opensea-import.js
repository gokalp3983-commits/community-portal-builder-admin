"use strict";

const OPENSEA_API_BASE = "https://api.opensea.io/api/v2";
let instantKey = null;

function text(value) {
  const out = String(value == null ? "" : value).trim();
  return out || null;
}

function first(...values) {
  for (const value of values) if (value !== null && value !== undefined && value !== "") return value;
  return null;
}

function validAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(String(value || "").trim());
}

function parseOpenSeaCollectionUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) throw Object.assign(new Error("Paste an OpenSea collection URL first."), { code: "OPENSEA_URL_REQUIRED" });
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`);
  } catch {
    throw Object.assign(new Error("OpenSea URL is not valid."), { code: "INVALID_OPENSEA_URL" });
  }
  if (!/(^|\.)opensea\.io$/i.test(url.hostname)) {
    throw Object.assign(new Error("URL must use opensea.io."), { code: "INVALID_OPENSEA_HOST" });
  }
  const parts = url.pathname.split("/").filter(Boolean);
  const i = parts.findIndex(part => part.toLowerCase() === "collection");
  const slug = i >= 0 ? decodeURIComponent(parts[i + 1] || "").trim() : "";
  if (!slug) {
    throw Object.assign(new Error("Use a collection URL such as opensea.io/collection/your-collection."), { code: "INVALID_OPENSEA_COLLECTION_URL" });
  }
  return { slug, url: `https://opensea.io/collection/${encodeURIComponent(slug)}` };
}

async function responseJson(response, label) {
  const body = await response.text();
  let data = null;
  try { data = body ? JSON.parse(body) : {}; } catch { data = {}; }
  if (!response.ok) {
    const message = text(data?.detail) || text(data?.error) || text(data?.message) || `${label} HTTP ${response.status}`;
    const error = new Error(message);
    error.code = response.status === 401 || response.status === 403 ? "OPENSEA_AUTH_FAILED" : response.status === 404 ? "OPENSEA_COLLECTION_NOT_FOUND" : "OPENSEA_API_ERROR";
    error.status = response.status;
    throw error;
  }
  return data;
}

async function getOpenSeaApiKey(fetchImpl = fetch) {
  const configured = text(process.env.OPENSEA_API_KEY);
  if (configured) return { key: configured, source: "configured" };

  const now = Date.now();
  if (instantKey?.key && instantKey.expiresAt - now > 5 * 60 * 1000) return { key: instantKey.key, source: "instant" };

  const response = await fetchImpl(`${OPENSEA_API_BASE}/auth/keys`, {
    method: "POST",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  const data = await responseJson(response, "OpenSea instant API key");
  const key = text(data.api_key);
  if (!key) throw Object.assign(new Error("OpenSea did not return an API key."), { code: "OPENSEA_KEY_UNAVAILABLE" });
  const expiresAt = Date.parse(data.expires_at || "") || now + 6 * 24 * 60 * 60 * 1000;
  instantKey = { key, expiresAt };
  return { key, source: "instant" };
}

function normalizeChain(value) {
  const chain = text(value);
  if (!chain) return null;
  return chain.replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function contractFromCollection(collection = {}) {
  const contracts = Array.isArray(collection.contracts) ? collection.contracts : [];
  const candidate = contracts.find(item => validAddress(item?.address)) || contracts.find(item => validAddress(item?.contract_address));
  if (!candidate) return { address: null, chain: null, standard: null };
  return {
    address: first(text(candidate.address), text(candidate.contract_address)),
    chain: first(text(candidate.chain), text(candidate.blockchain)),
    standard: first(text(candidate.contract_standard), text(candidate.standard)),
  };
}

function normalizeCollection(collection = {}, { slug, url }, contractDetails = {}) {
  const contract = contractFromCollection(collection);
  const twitter = first(text(collection.twitter_username), text(collection.twitter));
  const x = twitter ? (/^https?:\/\//i.test(twitter) ? twitter : `https://x.com/${twitter.replace(/^@/, "")}`) : null;
  const telegram = first(text(collection.telegram_url), text(collection.telegram));
  const website = first(text(collection.external_url), text(collection.website_url), text(collection.website));
  const supply = first(collection.total_supply, collection.totalSupply, collection.supply);
  const name = first(text(collection.name), text(contractDetails.name));
  const standard = first(text(contract.standard), text(contractDetails.contract_standard), text(contractDetails.standard));
  const symbol = first(text(collection.symbol), text(contractDetails.symbol));
  const chainRaw = first(text(contract.chain), text(collection.chain), text(contractDetails.chain));

  return {
    slug,
    openSeaUrl: url,
    collectionName: name,
    description: text(collection.description),
    supply: supply == null ? null : String(supply),
    imageUrl: first(text(collection.image_url), text(collection.imageUrl)),
    bannerImageUrl: first(text(collection.banner_image_url), text(collection.bannerImageUrl)),
    contractAddress: contract.address,
    chain: chainRaw,
    chainLabel: normalizeChain(chainRaw),
    standard,
    symbol,
    links: { website, x, telegram },
  };
}


function pickTime(stage, keys) {
  for (const key of keys) {
    const value = stage?.[key];
    if (value === null || value === undefined || value === "") continue;
    if (typeof value === "number") {
      const ms = value > 1e12 ? value : value * 1000;
      const date = new Date(ms);
      if (!Number.isNaN(date.getTime())) return date.toISOString();
    }
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return null;
}

function priceText(stage = {}) {
  const direct = first(stage.price, stage.mint_price, stage.mintPrice, stage.cost);
  if (direct !== null && typeof direct !== "object") {
    const raw = String(direct).trim();
    if (raw === "0" || /^0(?:\.0+)?$/.test(raw)) return "FREE";
    const symbol = first(text(stage.currency_symbol), text(stage.currency), text(stage.payment_token?.symbol), text(stage.paymentToken?.symbol));
    return symbol ? `${raw} ${symbol}` : raw;
  }
  const obj = direct && typeof direct === "object" ? direct : first(stage.payment_token, stage.paymentToken);
  if (obj && typeof obj === "object") {
    const amount = first(obj.display_amount, obj.displayAmount, obj.amount, obj.value, obj.price);
    const symbol = first(text(obj.symbol), text(obj.currency), text(obj.token_symbol));
    if (amount !== null && amount !== undefined) {
      const raw = String(amount).trim();
      if (raw === "0" || /^0(?:\.0+)?$/.test(raw)) return "FREE";
      return symbol ? `${raw} ${symbol}` : raw;
    }
  }
  return null;
}

function limitText(stage = {}) {
  const value = first(stage.max_mint_per_wallet, stage.max_mint_per_address, stage.max_per_wallet, stage.maxPerWallet, stage.wallet_limit, stage.walletLimit, stage.mint_limit, stage.mintLimit, stage.max_mintable);
  return value === null || value === undefined ? null : String(value);
}

function stageArray(drop = {}) {
  const candidates = [drop.stages, drop.drop_stages, drop.mint_stages, drop.mintStages, drop.phases, drop.drop?.stages, drop.data?.stages];
  const list = candidates.find(Array.isArray);
  if (list) return list;
  return [drop.current_stage, drop.next_stage].filter(Boolean);
}

function phaseNumber(label) {
  const match = String(label || "").match(/(?:phase|stage)\s*[-#:]?\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function normalizeDrop(drop = {}) {
  const stages = stageArray(drop).map((stage, index) => ({
    label: first(text(stage.label), text(stage.name), text(stage.stage_name), text(stage.stage_type), text(stage.title), `PHASE ${index + 1}`),
    startsAt: pickTime(stage, ["start_time", "startTime", "starts_at", "startsAt", "start_date", "startDate", "start"]),
    endsAt: pickTime(stage, ["end_time", "endTime", "ends_at", "endsAt", "end_date", "endDate", "end"]),
    price: priceText(stage),
    limit: limitText(stage),
    _sourceIndex: index,
  })).filter(stage => stage.startsAt || stage.endsAt || stage.price || stage.limit || stage.label);

  // OpenSea does not guarantee mint-stage array order. CPB phase order is chronological:
  // earliest start first, then earliest end, then an explicit Phase/Stage number, finally source order.
  stages.sort((a, b) => {
    const aStart = a.startsAt ? Date.parse(a.startsAt) : Number.POSITIVE_INFINITY;
    const bStart = b.startsAt ? Date.parse(b.startsAt) : Number.POSITIVE_INFINITY;
    if (aStart !== bStart) return aStart - bStart;
    const aEnd = a.endsAt ? Date.parse(a.endsAt) : Number.POSITIVE_INFINITY;
    const bEnd = b.endsAt ? Date.parse(b.endsAt) : Number.POSITIVE_INFINITY;
    if (aEnd !== bEnd) return aEnd - bEnd;
    const aPhase = phaseNumber(a.label);
    const bPhase = phaseNumber(b.label);
    if (aPhase !== null || bPhase !== null) return (aPhase ?? Number.POSITIVE_INFINITY) - (bPhase ?? Number.POSITIVE_INFINITY);
    return a._sourceIndex - b._sourceIndex;
  });
  stages.forEach(stage => { delete stage._sourceIndex; });
  const status = first(text(drop.status), text(drop.state), text(drop.drop_status), text(drop.drop?.status));
  return { status, stages };
}

async function importOpenSeaCollection(input, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const parsed = parseOpenSeaCollectionUrl(input);
  const auth = await getOpenSeaApiKey(fetchImpl);
  const headers = { accept: "application/json", "x-api-key": auth.key };
  const response = await fetchImpl(`${OPENSEA_API_BASE}/collections/${encodeURIComponent(parsed.slug)}`, {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  const collection = await responseJson(response, "OpenSea collection");

  let dropDetails = {};
  try {
    const dropResponse = await fetchImpl(`${OPENSEA_API_BASE}/drops/${encodeURIComponent(parsed.slug)}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (dropResponse.ok) dropDetails = await responseJson(dropResponse, "OpenSea drop");
  } catch {
    dropDetails = {};
  }

  const baseContract = contractFromCollection(collection);
  let contractDetails = {};
  if (baseContract.address && baseContract.chain) {
    try {
      const contractResponse = await fetchImpl(`${OPENSEA_API_BASE}/chain/${encodeURIComponent(baseContract.chain)}/contract/${encodeURIComponent(baseContract.address)}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });
      contractDetails = await responseJson(contractResponse, "OpenSea contract");
    } catch {
      contractDetails = {};
    }
  }

  const nft = normalizeCollection(collection, parsed, contractDetails);
  nft.drop = normalizeDrop(dropDetails);
  const warnings = [];
  if (!nft.contractAddress) warnings.push("OpenSea did not return a contract address. Add it manually before creating the portal.");
  if (!nft.symbol) warnings.push("Collection symbol was not returned. Review the project ticker manually.");
  if (!nft.links.website) warnings.push("No project website was returned by OpenSea.");

  return {
    ok: true,
    provider: "OpenSea",
    apiKeyMode: auth.source,
    nft,
    warnings,
  };
}

module.exports = {
  parseOpenSeaCollectionUrl,
  normalizeCollection,
  normalizeDrop,
  importOpenSeaCollection,
};
