/* ── Watchlist ─────────────────────────────────────────────────────── */
const DEFAULT_WATCHLIST = WATCHLIST.slice();

function getWatchlist() {
  const raw = localStorage.getItem("watchlist");
  return raw ? JSON.parse(raw) : [...DEFAULT_WATCHLIST];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function addTicker(ticker) {
  ticker = ticker.toUpperCase().trim();
  if (!ticker) return "Please enter a ticker symbol.";
  const list = getWatchlist();
  if (list.includes(ticker)) return `${ticker} is already on your watchlist.`;
  list.push(ticker);
  saveWatchlist(list);
  return null;
}

function removeTicker(ticker) {
  const list = getWatchlist().filter(t => t !== ticker);
  saveWatchlist(list);
}

/* ── Render sidebar earnings calendar widget ──────────────────────── */
function renderEarningsCalendar(calendar) {
  const el = document.getElementById('sidebar-cal');
  if (!el) return;
  const items = Array.isArray(calendar) ? calendar.slice(0, 7) : [];
  if (!items.length) {
    el.innerHTML = '<div class="sidebar-section-label">Upcoming Earnings</div><div style="font-size:11px;color:#ccc">None in next 45 days</div>';
    return;
  }
  el.innerHTML = `<div class="sidebar-section-label">Upcoming Earnings</div>` +
    items.map(e => `
      <div class="sidebar-cal-item">
        <span class="sidebar-cal-ticker">${e.symbol}</span>
        <div class="sidebar-cal-date">${e.date}${e.time === 'amc' ? ' AMC' : e.time === 'bmo' ? ' BMO' : ''}</div>
      </div>`).join('');
}

/* ── Render sidebar watchlist as collapsible sector groups ────────── */
function renderSidebarWatchlist(activeTicker) {
  const el = document.getElementById('sidebar-wl-links');
  if (!el) return;
  const wl = getWatchlist();
  el.innerHTML = Object.entries(SECTORS).map(([sector, tickers]) => {
    const visible = tickers.filter(t => wl.includes(t));
    if (!visible.length) return '';
    const links = visible.map(t => {
      const cls = t === activeTicker ? ' class="active"' : '';
      return `<li><a href="company.html?t=${t}"${cls}>${t}</a></li>`;
    }).join('');
    return `<details class="sidebar-sector" open>
      <summary class="sidebar-sector-hdr">
        <span class="sidebar-sector-dot sector-dot-${sectorClass(sector)}"></span>${sector}
      </summary>
      <ul class="sidebar-sector-tickers">${links}</ul>
    </details>`;
  }).join('');
}

/* ── Render watchlist page cards ──────────────────────────────────── */
function renderWatchlistCards() {
  const grid = document.getElementById("watchlist-grid");
  if (!grid) return;
  const list = getWatchlist();
  if (list.length === 0) {
    grid.innerHTML = '<p style="color:#aaa;font-size:13px;grid-column:1/-1">Your watchlist is empty. Add a ticker below.</p>';
    return;
  }
  grid.innerHTML = list.map(t => {
    const name = COMPANY_NAMES[t] || t;
    return `
    <div class="wl-card" id="card-${t}">
      <button class="wl-remove" onclick="handleRemove('${t}')" title="Remove">&times;</button>
      <div class="wl-ticker">${t}</div>
      <div class="wl-name">${name}</div>
      <div class="wl-row" id="wl-price-${t}" style="font-size:13px;color:#aaa">Loading price…</div>
      <div class="wl-row" id="wl-earn-${t}" style="font-size:12px;color:#aaa">Loading earnings…</div>
      <div class="wl-links">
        <a class="wl-link" href="preview.html?t=${t}">Preview</a>
        <a class="wl-link" href="financials.html?t=${t}">Financials</a>
        <a class="wl-link" href="review.html?t=${t}">Review</a>
      </div>
    </div>`;
  }).join("");
}

function handleRemove(ticker) {
  removeTicker(ticker);
  renderWatchlistCards();
  renderSidebarWatchlist();
}

function handleAddForm() {
  const input = document.getElementById("ticker-input");
  const msg   = document.getElementById("add-msg");
  if (!input) return;
  const err = addTicker(input.value);
  if (err) {
    msg.textContent = err;
  } else {
    msg.textContent = "";
    input.value = "";
    renderWatchlistCards();
    renderSidebarWatchlist();
  }
}

/* ── Tabs ─────────────────────────────────────────────────────────── */
function initTabs() {
  const btns   = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b   => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
}

/* ── Bar chart (SVG) ──────────────────────────────────────────────── */
function drawBarChart(containerId, bars) {
  /* bars: [{label, value, color, displayValue}] */
  const container = document.getElementById(containerId);
  if (!container) return;

  const W = 420, H = 180, PAD = { top: 20, right: 20, bottom: 36, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  const maxVal  = Math.max(...bars.map(b => b.value)) * 1.15;
  const barW    = Math.min(52, (chartW / bars.length) * 0.55);
  const spacing = chartW / bars.length;

  /* Y gridlines */
  const ticks = 4;
  let gridLines = "";
  let gridLabels = "";
  for (let i = 0; i <= ticks; i++) {
    const y    = PAD.top + chartH - (i / ticks) * chartH;
    const val  = ((i / ticks) * maxVal).toFixed(1);
    gridLines  += `<line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}" stroke="#f0f0ec" stroke-width="1"/>`;
    gridLabels += `<text x="${PAD.left - 6}" y="${y + 4}" text-anchor="end" font-size="9" fill="#bbb">${val}</text>`;
  }

  let barsSVG = "";
  bars.forEach((b, i) => {
    const barH  = (b.value / maxVal) * chartH;
    const x     = PAD.left + i * spacing + (spacing - barW) / 2;
    const y     = PAD.top  + chartH - barH;
    const labelY = PAD.top + chartH + 16;
    const valY   = y - 5;
    barsSVG += `
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${b.color}" rx="2"/>
      <text x="${x + barW / 2}" y="${valY}" text-anchor="middle" font-size="10" fill="#555">${b.displayValue}</text>
      <text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" font-size="10" fill="#888">${b.label}</text>`;
  });

  /* Axes */
  const axes = `
    <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="#ddd" stroke-width="1"/>
    <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="#ddd" stroke-width="1"/>`;

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;">
      ${gridLines}${gridLabels}${axes}${barsSVG}
    </svg>`;
}

/* ── Init on DOMContentLoaded ─────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderSidebarWatchlist();
  renderWatchlistCards();
  initTabs();

  /* Watchlist add form */
  const addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", handleAddForm);
    document.getElementById("ticker-input")?.addEventListener("keydown", e => {
      if (e.key === "Enter") handleAddForm();
    });
  }

  /* Guidance Deep Dive bar chart */
  if (document.getElementById("guide-chart")) {
    drawBarChart("guide-chart", [
      { label: "Q1 Guide",   value: 10.8, color: "#d4a017", displayValue: "$10.8B" },
      { label: "Q1 Actual",  value: 11.4, color: "#2d7a2d", displayValue: "$11.4B" },
      { label: "Q2 Guide",   value: 11.7, color: "#2c5f8a", displayValue: "$11.7B" },
    ]);
  }

  /* Business model bar chart */
  if (document.getElementById("springboard-chart")) {
    drawBarChart("springboard-chart", [
      { label: "2023 Base",   value: 12.8, color: "#ccc",    displayValue: "$12.8B" },
      { label: "Orig. Target",value: 20.8, color: "#d4a017", displayValue: "+$8B" },
      { label: "Upg. Target", value: 23.8, color: "#2d7a2d", displayValue: "+$11B" },
      { label: "2026 Plan",   value: 19.3, color: "#2c5f8a", displayValue: "+$6.5B" },
    ]);
  }

  /* Show-more toggle on home page */
  const showMoreBtn = document.getElementById("show-more-btn");
  const hiddenCards = document.querySelectorAll(".news-card.hidden-card");
  if (showMoreBtn && hiddenCards.length) {
    showMoreBtn.addEventListener("click", e => {
      e.preventDefault();
      const open = showMoreBtn.dataset.open === "true";
      hiddenCards.forEach(c => c.style.display = open ? "none" : "flex");
      showMoreBtn.textContent = open ? `Show all ${hiddenCards.length} articles ↓` : "Hide extra articles ↑";
      showMoreBtn.dataset.open = (!open).toString();
    });
  }
});
