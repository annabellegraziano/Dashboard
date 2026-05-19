/* ── Cache helpers ─────────────────────────────────────────────────
   TTL-based localStorage cache to respect free-tier rate limits.
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

/* ── FMP helpers ───────────────────────────────────────────────────── */

async function fmpFetch(path, ttlMs = 300_000) {
  const key = getKeys().fmp;
  if (!key) throw new Error('FMP API key not configured — go to Settings.');
  const cacheKey = path.replace(/[^a-z0-9]/gi, '_');
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const url = `${FMP_BASE}${path}${path.includes('?') ? '&' : '?'}apikey=${key}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`FMP ${r.status}: ${r.statusText}`);
  const data = await r.json();
  if (data && !data['Error Message']) cacheSet(cacheKey, data, ttlMs);
  return data;
}

/* ── FMP: Stock news ───────────────────────────────────────────────── */

async function fetchNews(tickers = WATCHLIST, limit = 20) {
  const data = await fmpFetch(`/stock_news?tickers=${tickers.join(',')}&limit=${limit}`, 15 * 60_000);
  return Array.isArray(data) ? data : [];
}

/* ── FMP: Earnings calendar (next 45 days, filtered to watchlist) ──── */

async function fetchEarningsCalendar() {
  const from = new Date().toISOString().slice(0, 10);
  const to   = new Date(Date.now() + 45 * 86_400_000).toISOString().slice(0, 10);
  const data = await fmpFetch(`/earning_calendar?from=${from}&to=${to}`, 60 * 60_000);
  return Array.isArray(data) ? data.filter(e => WATCHLIST.includes(e.symbol)) : [];
}

/* ── FMP: Earnings surprises (historical beat/miss) ────────────────── */

async function fetchEarningsSurprises(ticker) {
  const data = await fmpFetch(`/earnings-surprises/${ticker}`, 6 * 60 * 60_000);
  return Array.isArray(data) ? data.slice(0, 8) : [];
}

/* ── FMP: Quarterly income statement ──────────────────────────────── */

async function fetchIncomeStatement(ticker, limit = 8) {
  const data = await fmpFetch(`/income-statement/${ticker}?period=quarter&limit=${limit}`, 6 * 60 * 60_000);
  return Array.isArray(data) ? data : [];
}

/* ── FMP: Company profile + live quote ────────────────────────────── */

async function fetchProfile(ticker) {
  const data = await fmpFetch(`/profile/${ticker}`, 5 * 60_000);
  return Array.isArray(data) && data[0] ? data[0] : null;
}

async function fetchQuoteBulk(tickers) {
  const joined = tickers.join(',');
  const data = await fmpFetch(`/quote/${joined}`, 5 * 60_000);
  if (!Array.isArray(data)) return {};
  const map = {};
  data.forEach(q => { map[q.symbol] = q; });
  return map;
}

/* ── Alpha Vantage: Global Quote ───────────────────────────────────── */
/* Free tier: 25 requests/day. Results cached 15 min per ticker.      */

async function fetchAVQuote(ticker) {
  const cacheKey = `av_${ticker}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const key = getKeys().av;
  if (!key) return null;

  try {
    const url = `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    const q = data['Global Quote'];
    if (!q || !q['05. price']) return null;

    const result = {
      price:     parseFloat(q['05. price']).toFixed(2),
      change:    parseFloat(q['09. change']).toFixed(2),
      changePct: parseFloat(q['10. change percent']).toFixed(2),
      source:    'Alpha Vantage',
    };
    cacheSet(cacheKey, result, 15 * 60_000);
    return result;
  } catch { return null; }
}

/* Fetch AV quotes sequentially (respect 5 req/min limit) */
async function fetchAVQuotes(tickers) {
  const results = {};
  for (const t of tickers) {
    results[t] = await fetchAVQuote(t);
    await new Promise(res => setTimeout(res, 250)); // gentle pacing
  }
  return results;
}

/* ── Merge price data: AV primary, FMP fallback ──────────────────── */

function normalizeQuote(fmpQ, avQ) {
  if (avQ) return avQ;
  if (!fmpQ) return null;
  return {
    price:     fmpQ.price?.toFixed(2),
    change:    fmpQ.change?.toFixed(2),
    changePct: fmpQ.changesPercentage?.toFixed(2),
    source:    'FMP',
  };
}

/* ── Notes: persist analyst notes per ticker/page to localStorage ─── */

function getNoteKey(type, ticker) {
  return `note_${type}_${ticker}`;
}
function loadNote(type, ticker) {
  return localStorage.getItem(getNoteKey(type, ticker)) || '';
}
function saveNote(type, ticker, text) {
  localStorage.setItem(getNoteKey(type, ticker), text);
}
