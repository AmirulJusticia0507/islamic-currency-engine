const { GoldPrice } = require("../models");
const { DINAR_GRAM } = require("./shariahValidator");

const GRAM_PER_TROY_OUNCE = 31.1034768;
const DEFAULT_PRICE_PER_GRAM_USD = 62.0; // fallback statis bila oracle mati
let lastFetchAt = 0;
let cached = null;

async function fetchLivePriceUsd() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", { signal: controller.signal });
    if (!res.ok) throw new Error("oracle status " + res.status);
    const data = await res.json();
    const pricePerOunceUsd = Number(data.price);
    if (!(pricePerOunceUsd > 0)) throw new Error("harga invalid");
    return { perGramUsd: pricePerOunceUsd / GRAM_PER_TROY_OUNCE, source: "LIVE" };
  } catch {
    return { perGramUsd: DEFAULT_PRICE_PER_GRAM_USD, source: "DEFAULT" };
  } finally {
    clearTimeout(timer);
  }
}

async function getCurrentPrice({ force = false } = {}) {
  const now = Date.now();
  if (!force && cached && now - lastFetchAt < 60_000) return cached;

  const { perGramUsd, source } = await fetchLivePriceUsd();
  const pricePerDinarUsd = perGramUsd * DINAR_GRAM;

  const rec = await GoldPrice.create({
    price_per_gram_usd: perGramUsd,
    price_per_dinar_usd: pricePerDinarUsd,
    source,
  });

  cached = {
    price_per_gram_usd: Number(perGramUsd.toFixed(4)),
    price_per_dinar_usd: Number(pricePerDinarUsd.toFixed(4)),
    source,
    updated_at: rec.recorded_at,
  };
  lastFetchAt = now;
  return cached;
}

async function getHistory(limit = 30) {
  const rows = await GoldPrice.findAll({ order: [["recorded_at", "DESC"]], limit: Number(limit) || 30 });
  return rows.reverse().map((r) => ({
    price_per_gram_usd: r.price_per_gram_usd,
    price_per_dinar_usd: r.price_per_dinar_usd,
    source: r.source,
    recorded_at: r.recorded_at,
  }));
}

module.exports = { getCurrentPrice, getHistory };