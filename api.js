/* ── Cache helpers ─────────────────────────────────────────────────
   TTL-based localStorage cache to avoid hammering free-tier APIs.
   ─────────────────────────────────────────────────────────────── */

function cacheGet(key) {
  try {
    const item = JSON.parse(localStorage.getItem('_c_' + key));
    if (item && Date.now() - item.ts < item.ttl) return item.data;
  } catch {}
  return null;
}
function cacheSet(key, data, ttlMs) {
  try {
    localStorage.setItem('_c_' + key, JSON.stringify({ data, ts: Date.now(), ttl: ttlMs }));
  } catch {}
}
function cacheClear(prefix) {
  Object.keys(localStorage).filter(k => k.startsWith('_c_' + (prefix || ''))).forEach(k => localStorage.removeItem(k));
}

/* ── Yahoo Finance via allorigins CORS proxy ───────────────────────
   No API key required. Proxy returns { contents: "<json string>" }.
   ─────────────────────────────────────────────────────────────── */

/* TSMC trades as TSM (ADR) on US exchanges */
const YF_TICKERS = { TSMC: 'TSM' };

async function yfFetch(path, ttlMs = 300_000) {
  const cacheKey = path.replace(/[^a-z0-9]/gi, '_');
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const yfUrl = `https://query1.finance.yahoo.com${path}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(yfUrl)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Proxy ${r.status}`);
  const wrapper = await r.json();
  if (!wrapper.contents) throw new Error('Empty proxy response');
  const data = JSON.parse(wrapper.contents);
  cacheSet(cacheKey, data, ttlMs);
  return data;
}

/* Returns { price, change, changePct } or null */
async function fetchYFQuote(ticker) {
  try {
    const sym = YF_TICKERS[ticker] || ticker;
    const data = await yfFetch(`/v8/finance/chart/${sym}?range=1d&interval=1d`, 5 * 60_000);
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    const price = meta.regularMarketPrice;
    const prev  = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change    = price - prev;
    const changePct = prev ? (change / prev) * 100 : 0;
    return {
      price:     price.toFixed(2),
      change:    change.toFixed(2),
      changePct: changePct.toFixed(2),
    };
  } catch { return null; }
}

/* Fetch quotes sequentially with 300ms pacing to avoid proxy throttling */
async function fetchYFQuotes(tickers) {
  const results = {};
  for (const t of tickers) {
    results[t] = await fetchYFQuote(t);
    await new Promise(res => setTimeout(res, 300));
  }
  return results;
}

/* Returns { earningsDate, revenueEst, epsEst } or null */
async function fetchYFEarnings(ticker) {
  try {
    const sym  = YF_TICKERS[ticker] || ticker;
    const path = `/v10/finance/quoteSummary/${sym}?modules=calendarEvents%2CearningsTrend`;
    const data = await yfFetch(path, 60 * 60_000);
    const result = data?.quoteSummary?.result?.[0];
    if (!result) return null;

    const cal   = result.calendarEvents?.earnings;
    const trend = result.earningsTrend?.trend ?? [];
    const curQ  = trend.find(t => t.period === '0q');

    let earningsDate = null;
    if (cal?.earningsDate?.[0]) {
      const d   = cal.earningsDate[0];
      const raw = d.fmt || (d.raw ? new Date(d.raw * 1000).toISOString().slice(0, 10) : null);
      if (raw) {
        earningsDate = new Date(raw + 'T12:00:00Z')
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }

    const revRaw = cal?.revenueAverage?.raw ?? curQ?.revenueEstimate?.avg?.raw ?? null;
    const revenueEst = revRaw != null
      ? (revRaw >= 1e9 ? `$${(revRaw / 1e9).toFixed(1)}B` : `$${(revRaw / 1e6).toFixed(0)}M`)
      : null;

    const epsRaw = cal?.earningsAverage?.raw ?? cal?.epsAverage?.raw
      ?? curQ?.earningsEstimate?.avg?.raw ?? null;
    const epsEst = epsRaw != null ? `$${epsRaw.toFixed(2)}` : null;

    return { earningsDate, revenueEst, epsEst };
  } catch { return null; }
}

/* ── Notes: persist analyst notes per ticker/page to localStorage ─── */

function getNoteKey(type, ticker) { return `note_${type}_${ticker}`; }
function loadNote(type, ticker)   { return localStorage.getItem(getNoteKey(type, ticker)) || ''; }
function saveNote(type, ticker, text) { localStorage.setItem(getNoteKey(type, ticker), text); }
