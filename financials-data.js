/* ── Quarterly financial data ───────────────────────────────────────
   Quarters run left to right, oldest → newest.
   Non-GAAP figures used where noted (matches analyst consensus).
   "—" = not yet reported or not available. Update after each earnings.
   ─────────────────────────────────────────────────────────────── */

const FINANCIALS_DATA = {

  NVDA: {
    quarters: ['Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25','Q1 FY26'],
    note: 'Non-GAAP EPS, post-10-for-1 split adj. (eff. Jun 2024). Gross margin and Op. Income are non-GAAP. Fiscal year ends Jan 31.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$13.5B','$18.1B','$22.1B','$26.0B','$30.0B','$35.1B','$39.3B','$44.1B'] },
      { key:'gm',   label:'Gross Margin',         values:['70.1%', '74.0%', '76.7%', '78.4%', '75.1%', '74.6%', '73.0%', '73.5%'] },
      { key:'oi',   label:'Operating Income',     values:['$6.8B', '$10.4B','$13.6B','$16.9B','$18.6B','$21.9B','$23.6B','$27.1B'] },
      { key:'eps',  label:'EPS (Non-GAAP)',       values:['$0.27', '$0.40', '$0.52', '$0.61', '$0.68', '$0.78', '$0.89', '$0.96'] },
      { key:'spec', label:'Data Center Revenue',  values:['$10.3B','$14.5B','$18.4B','$22.6B','$26.3B','$30.8B','$35.6B','$39.1B'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA&type=10-&dateb=&owner=include&count=10',
  },

  AMD: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Non-GAAP EPS and gross margin. Calendar year.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$5.5B', '$5.8B', '$6.8B', '$7.7B', '$7.4B', '—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['52.0%', '53.0%', '54.0%', '54.0%', '53.1%', '—','—','—'] },
      { key:'oi',   label:'Operating Income',     values:['$1.1B', '$1.3B', '$1.7B', '$2.0B', '$1.9B', '—','—','—'] },
      { key:'eps',  label:'EPS (Non-GAAP)',       values:['$0.62', '$0.69', '$0.92', '$1.09', '$0.96', '—','—','—'] },
      { key:'spec', label:'Data Center Revenue',  values:['$2.3B', '$2.8B', '$3.5B', '$3.9B', '$3.7B', '—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=AMD&type=10-&dateb=&owner=include&count=10',
  },

  TSMC: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Revenue and Op. Income in USD (~TWD ÷ 31–32). EPS on per-ADR basis (1 ADR = 5 common shares, ~USD). Foreign private issuer — files 20-F annually on EDGAR.',
    metrics: [
      { key:'rev',  label:'Revenue (~USD)',       values:['$18.9B','$20.8B','$23.5B','$26.9B','$25.5B','—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['53.1%', '53.2%', '57.8%', '59.0%', '58.8%', '—','—','—'] },
      { key:'oi',   label:'Operating Income',     values:['$7.6B', '$8.7B', '$10.8B','$12.7B','$11.6B','—','—','—'] },
      { key:'eps',  label:'EPS (ADR, ~USD)',       values:['$1.42', '$1.48', '$1.94', '$2.24', '$2.12', '—','—','—'] },
      { key:'spec', label:'HPC Revenue (~USD)',   values:['$8.0B', '$9.8B', '$12.0B','$14.5B','$13.5B','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=TSM&type=20-F&dateb=&owner=include&count=10',
  },

  ASML: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Revenue, Op. Income, and EPS in EUR. Net Bookings are the key forward indicator. Foreign private issuer — files 20-F on EDGAR.',
    metrics: [
      { key:'rev',  label:'Revenue (EUR)',        values:['€5.3B', '€6.2B', '€7.5B', '€9.3B', '€7.7B', '—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['51.0%', '51.5%', '50.8%', '51.7%', '54.0%', '—','—','—'] },
      { key:'oi',   label:'Operating Income (EUR)',values:['€1.5B', '€1.6B', '€2.1B', '€2.7B', '€2.3B', '—','—','—'] },
      { key:'eps',  label:'EPS (EUR, GAAP)',       values:['€3.11', '€4.01', '€5.28', '€6.85', '€6.00', '—','—','—'] },
      { key:'spec', label:'Net Bookings (EUR)',    values:['€3.6B', '€5.6B', '€2.6B', '€7.1B', '€3.9B', '—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ASML&type=20-F&dateb=&owner=include&count=10',
  },

  MSFT: {
    quarters: ['Q1 FY24','Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25'],
    note: 'GAAP EPS (diluted). Fiscal year ends Jun 30. Q1 = Jul–Sep, Q2 = Oct–Dec, Q3 = Jan–Mar, Q4 = Apr–Jun.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$56.5B','$62.0B','$61.9B','$64.7B','$65.6B','$69.6B','$70.1B','—'] },
      { key:'gm',   label:'Gross Margin',         values:['71.2%', '71.0%', '69.4%', '69.6%', '69.4%', '69.7%', '68.5%', '—'] },
      { key:'oi',   label:'Operating Income',     values:['$26.9B','$27.0B','$27.6B','$27.9B','$30.6B','$31.7B','$32.0B','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$2.99', '$2.93', '$2.94', '$2.95', '$3.30', '$3.23', '$3.46', '—'] },
      { key:'spec', label:'Intelligent Cloud Rev.',values:['$24.3B','$25.9B','$26.7B','$28.5B','—',     '—',     '—',     '—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MSFT&type=10-&dateb=&owner=include&count=10',
  },

  GOOGL: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS (diluted). Calendar year.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$80.5B','$84.7B','$88.3B','$96.5B','$90.2B','—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['57.4%', '58.0%', '58.0%', '57.5%', '59.5%', '—','—','—'] },
      { key:'oi',   label:'Operating Income',     values:['$25.5B','$27.4B','$28.5B','$30.9B','$30.6B','—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$1.89', '$1.89', '$2.12', '$2.15', '$2.81', '—','—','—'] },
      { key:'spec', label:'Google Cloud Revenue', values:['$9.6B', '$10.4B','$11.4B','$12.0B','$12.3B','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=GOOGL&type=10-&dateb=&owner=include&count=10',
  },

  META: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS (diluted). Calendar year. Daily Active People (DAP) across all Meta family apps.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$36.5B','$39.1B','$40.6B','$48.4B','$42.3B','—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['81.0%', '81.0%', '82.0%', '82.4%', '82.5%', '—','—','—'] },
      { key:'oi',   label:'Operating Income',     values:['$13.8B','$14.8B','$17.0B','$23.4B','$17.6B','—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$4.71', '$5.16', '$6.03', '$8.02', '$6.43', '—','—','—'] },
      { key:'spec', label:'Daily Active People',  values:['3.24B', '3.27B', '3.29B', '3.35B', '3.43B', '—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=META&type=10-&dateb=&owner=include&count=10',
  },

  COIN: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS (diluted). Calendar year. Revenue = total net revenue. No traditional gross margin (fee-based business).',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$1.6B', '$1.4B', '$1.2B', '$2.3B', '—','—','—','—'] },
      { key:'gm',   label:'Gross Margin',         values:['—',    '—',    '—',    '—',    '—','—','—','—'] },
      { key:'oi',   label:'Net Income',           values:['$1.18B','$0.04B','$0.07B','$1.29B','—','—','—','—'] },
      { key:'eps',  label:'EPS (GAAP, diluted)',  values:['$2.66', '$0.09', '$0.28', '$4.68', '—','—','—','—'] },
      { key:'spec', label:'Trading Volume',       values:['$312B', '$226B', '$185B', '$439B', '—','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=COIN&type=10-&dateb=&owner=include&count=10',
  },

  JPM: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS. Revenue = managed net revenue (includes First Republic and Visa-related items in Q2 2024). Calendar year.',
    metrics: [
      { key:'rev',  label:'Net Revenue',          values:['$41.9B','$50.2B','$43.3B','$43.7B','—','—','—','—'] },
      { key:'gm',   label:'Net Margin',           values:['32.0%', '36.0%', '30.0%', '32.0%', '—','—','—','—'] },
      { key:'oi',   label:'Net Income',           values:['$13.4B','$18.1B','$12.9B','$14.0B','—','—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$4.44', '$6.12', '$4.37', '$4.81', '—','—','—','—'] },
      { key:'spec', label:'Net Interest Income',  values:['$23.1B','$22.9B','$23.5B','$23.9B','—','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=JPM&type=10-&dateb=&owner=include&count=10',
  },

  GS: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS. Revenue = net revenue. Trading Revenue = Global Banking & Markets (FICC + Equities). Calendar year.',
    metrics: [
      { key:'rev',  label:'Net Revenue',          values:['$14.2B','$12.7B','$12.7B','$13.9B','—','—','—','—'] },
      { key:'gm',   label:'Net Margin',           values:['30.0%', '28.0%', '27.0%', '31.0%', '—','—','—','—'] },
      { key:'oi',   label:'Pre-Tax Income',       values:['$4.0B', '$3.7B', '$3.5B', '$4.1B', '—','—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$11.58','$8.62', '$8.40', '$11.95','—','—','—','—'] },
      { key:'spec', label:'Trading Revenue',      values:['$8.3B', '$7.2B', '$7.5B', '$7.6B', '—','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=GS&type=10-&dateb=&owner=include&count=10',
  },

  MSTR: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Now branded "Strategy." Software revenue is the legacy business. BTC Yield is company-defined KPI (change in BTC per diluted share). BTC Holdings value = qty × spot price at quarter-end.',
    metrics: [
      { key:'rev',  label:'Software Revenue',     values:['$115M', '$111M', '$116M', '$121M', '$111M','—','—','—'] },
      { key:'gm',   label:'Software Gross Margin',values:['74.0%', '73.0%', '74.0%', '75.0%', '73.0%','—','—','—'] },
      { key:'oi',   label:'BTC Holdings (qty)',   values:['214,246','226,331','252,220','446,400','~528K','—','—','—'] },
      { key:'eps',  label:'BTC Holdings ($B)',     values:['~$15B', '~$14B', '~$16B', '~$41B',  '~$43B','—','—','—'] },
      { key:'spec', label:'BTC Yield (quarter)',  values:['~4.4%', '~5.1%', '~5.5%', '~48.0%','~11.0%','—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MSTR&type=10-&dateb=&owner=include&count=10',
  },

  IBIT: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'iShares Bitcoin Trust ETF — launched Jan 11, 2024. No earnings. Tracks BTC price minus 0.25% expense ratio. All data as of quarter-end. Source: BlackRock / iShares.com.',
    metrics: [
      { key:'rev',  label:'AUM (end of qtr)',     values:['~$23B', '~$18B', '~$23B', '~$52B', '~$47B','—','—','—'] },
      { key:'gm',   label:'BTC Holdings (qty)',   values:['~320K', '~287K', '~352K', '~561K', '~570K','—','—','—'] },
      { key:'oi',   label:'BTC Price (end of qtr)',values:['~$71K', '~$61K', '~$64K', '~$93K', '~$82K','—','—','—'] },
      { key:'eps',  label:'NAV per Share (~)',     values:['~$37',  '~$32',  '~$33',  '~$49',  '~$42', '—','—','—'] },
      { key:'spec', label:'Net Inflows (quarter)',values:['~$14B', '~-$0.5B','~$4B', '~$19B', '~$5B', '—','—','—'] },
    ],
    edgar: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=IBIT&type=N-&dateb=&owner=include&count=10',
  },

};
