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

/* ── Claude API ────────────────────────────────────────────────────── */

async function callClaude(prompt, maxTokens = 2000) {
  const key = getKeys().claude;
  if (!key) throw new Error('Claude API key not configured — go to Settings.');

  const r = await fetch(CLAUDE_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-api-key':     key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API error ${r.status}`);
  }
  const data = await r.json();
  return data.content[0].text;
}

/* ── Claude: earnings preview prompt ─────────────────────────────── */

async function generateEarningsPreview(ticker, incomeStmts, calendar) {
  const co = COMPANY_NAMES[ticker] || ticker;

  const quarters = incomeStmts.slice(0, 4).map(q => {
    const rev  = (q.revenue / 1e9).toFixed(2);
    const ni   = (q.netIncome / 1e9).toFixed(2);
    const margin = q.operatingIncomeRatio ? (q.operatingIncomeRatio * 100).toFixed(1) + '%' : 'N/A';
    return `  ${q.date}: Revenue $${rev}B, Net Income $${ni}B, Op. Margin ${margin}, EPS $${q.eps?.toFixed(2) ?? 'N/A'}`;
  }).join('\n');

  const next = calendar.find(e => e.symbol === ticker);
  const nextStr = next
    ? `Next earnings: ${next.date} (${next.time || 'TBD'}). Consensus EPS: $${next.epsEstimated?.toFixed(2) ?? 'N/A'}, Revenue est: ${next.revenueEstimated ? '$' + (next.revenueEstimated / 1e9).toFixed(2) + 'B' : 'N/A'}`
    : 'Next earnings date: not confirmed.';

  const prompt = `You are a sell-side equity analyst at a major investment bank. Write a concise, professional earnings preview note for ${co} (${ticker}).

Recent quarterly financials:
${quarters}

${nextStr}

Write the preview in this exact structure using markdown:

**Executive Summary**
[2–3 sentences: what is the key setup and what should investors focus on]

**Key Metrics to Watch**
[3 specific metrics with context: what consensus expects and why it matters — written as sentences, not bullets]

**Key Debates**
[2–3 bull/bear debates written as: "Bull: … Bear: …" paragraphs]

**Thesis Impact**
[1 paragraph: if they beat/miss on the key metrics above, what does it mean for the longer-term thesis]

Tone: terse, professional, factual. No preamble. No bullet points except where specified. Under 450 words.`;

  return callClaude(prompt, 1200);
}

/* ── Claude: post-earnings review prompt ─────────────────────────── */

async function generateEarningsReview(ticker, incomeStmts, surprises) {
  const co = COMPANY_NAMES[ticker] || ticker;
  const latest = incomeStmts[0];
  const prior  = incomeStmts[4]; // same quarter prior year
  if (!latest) throw new Error('No income statement data available for ' + ticker);

  const yoy = prior && prior.revenue
    ? ((latest.revenue / prior.revenue - 1) * 100).toFixed(1) + '%'
    : 'N/A';

  const surprise = surprises[0];
  const beatMiss = surprise
    ? (surprise.actualEarningResult > surprise.estimatedEarning ? 'BEAT' : 'MISS')
    : 'N/A';
  const surpriseAmt = surprise
    ? `$${Math.abs(surprise.actualEarningResult - surprise.estimatedEarning).toFixed(2)}`
    : '';

  const prompt = `You are a sell-side equity analyst. Write a professional post-earnings review note for ${co} (${ticker}).

Quarter reported: ${latest.date}
Revenue: $${(latest.revenue / 1e9).toFixed(2)}B (YoY: ${yoy})
Gross Margin: ${latest.grossProfitRatio ? (latest.grossProfitRatio * 100).toFixed(1) + '%' : 'N/A'}
Operating Income: $${(latest.operatingIncome / 1e9).toFixed(2)}B
Operating Margin: ${latest.operatingIncomeRatio ? (latest.operatingIncomeRatio * 100).toFixed(1) + '%' : 'N/A'}
Net Income: $${(latest.netIncome / 1e9).toFixed(2)}B
EPS: $${latest.eps?.toFixed(2) ?? 'N/A'}
EPS vs consensus: ${beatMiss} by ${surpriseAmt}

Write the review in this exact structure using markdown:

**[TICKER] Q[N] [YEAR]: [Beat/Miss headline in one punchy sentence]**

**Executive Summary**
[3–4 sentences: what happened, was it good/bad, what drove results, initial thesis read]

**Key Segment Analysis**
[2–3 paragraphs on the most important business units or revenue drivers — inferred from the financials and your knowledge of the company]

**Guidance & Outlook**
[1–2 sentences on what management likely said or what the numbers imply for next quarter]

**Thesis Impact: [Positive / Neutral / Watch / Negative]**
[1 paragraph explaining the thesis impact and what to monitor]

Tone: terse, direct, professional. No preamble. Under 500 words.`;

  return callClaude(prompt, 1400);
}

/* ── Simple markdown → HTML renderer (for Claude output) ─────────── */

function mdToHtml(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h4 style="margin:16px 0 6px;font-size:0.95rem;color:#000">$1</h4>')
    .replace(/^## (.+)$/gm,  '<h3 style="margin:20px 0 8px;font-size:1.05rem;color:#000">$1</h3>')
    .replace(/\n\n/g, '</p><p style="margin-top:10px">')
    .replace(/^/, '<p style="margin:0">')
    .replace(/$/, '</p>');
}
