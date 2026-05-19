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
    await new Promise(res => setTimeout(res, 250));
  }
  return results;
}

/* ── Notes: persist analyst notes per ticker/page to localStorage ─── */

function getNoteKey(type, ticker) { return `note_${type}_${ticker}`; }
function loadNote(type, ticker)   { return localStorage.getItem(getNoteKey(type, ticker)) || ''; }
function saveNote(type, ticker, text) { localStorage.setItem(getNoteKey(type, ticker), text); }
