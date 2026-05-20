/* ── Quarterly financial data ───────────────────────────────────────
   Quarters run left to right, oldest → newest.
   "~" prefix = approximate; "—" = not yet reported. Update each quarter.
   Non-GAAP figures used for tech/semis (matches analyst consensus).
   ─────────────────────────────────────────────────────────────── */

const FINANCIALS_DATA = {

  /* ── NVIDIA ──────────────────────────────────────────────────── */
  NVDA: {
    quarters: ['Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25','Q1 FY26'],
    note: 'Non-GAAP EPS and margins; post-10-for-1 split adj. (eff. Jun 2024). Fiscal year ends Jan 31.',
    metrics: [
      { key:'rev',  label:'Revenue',            values:['$13.5B','$18.1B','$22.1B','$26.0B','$30.0B','$35.1B','$39.3B','$44.1B'] },
      { key:'gm',   label:'Gross Margin',        values:['70.1%', '74.0%', '76.7%', '78.4%', '75.1%', '74.6%', '73.0%', '73.5%'] },
      { key:'om',   label:'Op. Margin',          values:['50.4%', '57.5%', '61.5%', '65.0%', '62.0%', '62.4%', '60.1%', '61.5%'] },
      { key:'eps',  label:'EPS (Non-GAAP)',      values:['$0.27', '$0.40', '$0.52', '$0.61', '$0.68', '$0.78', '$0.89', '$0.96'] },
      { key:'spec', label:'Data Center Revenue', values:['$10.3B','$14.5B','$18.4B','$22.6B','$26.3B','$30.8B','$35.6B','$39.1B'] },
    ],
    estimates: {
      yearNote: 'FY2025 = actual (ended Jan 2025). FY2026/27 = Street consensus as of mid-2025.',
      years: ['FY2025 (A)','FY2026 (E)','FY2027 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['$130.5B','~$175B',  '~$215B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['+114%',  '~+34%',   '~+23%']   },
        { key:'eps',       label:'EPS (Non-GAAP)',   values:['$2.96',  '~$4.00',  '~$5.20']  },
        { key:'epsGrowth', label:'EPS YoY',          values:['+128%',  '~+35%',   '~+30%']   },
        { key:'gm',        label:'Gross Margin',     values:['~74.5%', '~73.0%',  '~73.5%']  },
        { key:'om',        label:'Op. Margin',       values:['~61.0%', '~62.0%',  '~63.0%']  },
      ],
    },
    latestQ: 'Q1 FY26',
    review: { eps:'$0.96', rev:'$44.1B', margin:'61.5%', surprise:'Beat +$0.04' },
    ir: 'https://investor.nvidia.com',
    edgarTicker: 'NVDA',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── AMD ─────────────────────────────────────────────────────── */
  AMD: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Non-GAAP EPS and gross margin. Calendar year.',
    metrics: [
      { key:'rev',  label:'Revenue',            values:['$5.5B', '$5.8B', '$6.8B', '$7.7B', '$7.4B', '~$7.7B','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['52.0%', '53.0%', '54.0%', '54.0%', '53.1%', '~53.0%','—','—'] },
      { key:'om',   label:'Op. Margin',          values:['20.0%', '22.4%', '25.0%', '26.0%', '25.7%', '~25.5%','—','—'] },
      { key:'eps',  label:'EPS (Non-GAAP)',      values:['$0.62', '$0.69', '$0.92', '$1.09', '$0.96', '~$1.10','—','—'] },
      { key:'spec', label:'Data Center Revenue', values:['$2.3B', '$2.8B', '$3.5B', '$3.9B', '$3.7B', '~$4.1B','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26/27 = Street consensus as of mid-2025.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['$25.8B', '~$34B',   '~$47B']   },
        { key:'revGrowth', label:'Revenue YoY',      values:['+14%',   '~+32%',   '~+38%']   },
        { key:'eps',       label:'EPS (Non-GAAP)',   values:['$3.31',  '~$5.40',  '~$7.20']  },
        { key:'epsGrowth', label:'EPS YoY',          values:['+44%',   '~+63%',   '~+33%']   },
        { key:'gm',        label:'Gross Margin',     values:['53.3%',  '~53.5%',  '~55.0%']  },
        { key:'om',        label:'Op. Margin',       values:['23.4%',  '~25.0%',  '~28.0%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'$0.96', rev:'$7.44B', margin:'25.7%', surprise:'Beat +$0.02' },
    ir: 'https://ir.amd.com',
    edgarTicker: 'AMD',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── TSMC ────────────────────────────────────────────────────── */
  TSMC: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Revenue in USD (converted ~TWD ÷ 31–33). EPS on per-ADR basis (1 ADR = 5 shares). Foreign private issuer — files 20-F on EDGAR.',
    metrics: [
      { key:'rev',  label:'Revenue (~USD)',      values:['$18.9B','$20.8B','$23.5B','$26.9B','$25.5B','~$28.7B','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['53.1%', '53.2%', '57.8%', '59.0%', '58.8%', '~57.8%','—','—'] },
      { key:'om',   label:'Op. Margin',          values:['40.2%', '41.8%', '46.0%', '47.2%', '45.5%', '~45.5%','—','—'] },
      { key:'eps',  label:'EPS (ADR, ~USD)',      values:['$1.42', '$1.48', '$1.94', '$2.24', '$2.12', '~$2.22','—','—'] },
      { key:'spec', label:'HPC Revenue (~USD)',   values:['$8.0B', '$9.8B', '$12.0B','$14.5B','$13.5B','~$17.0B','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual (TWD-denominated). USD approximations. CY2025/26 = consensus.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue (~USD)',   values:['~$90B',  '~$115B',  '~$140B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['+34%',   '~+28%',   '~+22%']   },
        { key:'eps',       label:'EPS (ADR, ~USD)',  values:['~$7.08', '~$9.50',  '~$11.50'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['+40%',   '~+34%',   '~+21%']   },
        { key:'gm',        label:'Gross Margin',     values:['~55.8%', '~58.0%',  '~59.0%']  },
        { key:'om',        label:'Op. Margin',       values:['~43.8%', '~45.0%',  '~46.5%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'~$2.12', rev:'~$25.5B', margin:'~45.5%', surprise:'Beat +$0.07' },
    ir: 'https://ir.tsmc.com',
    edgarTicker: 'TSM',
    filingTypes: ['20-F'],
  },

  /* ── ASML ────────────────────────────────────────────────────── */
  ASML: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Revenue, Op. Income, and EPS in EUR. Net Bookings are the key forward indicator. Foreign private issuer — files 20-F.',
    metrics: [
      { key:'rev',  label:'Revenue (EUR)',       values:['€5.3B', '€6.2B', '€7.5B', '€9.3B', '€7.7B', '~€7.9B','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['51.0%', '51.5%', '50.8%', '51.7%', '54.0%', '~53.0%','—','—'] },
      { key:'om',   label:'Op. Margin',          values:['28.3%', '25.8%', '28.0%', '29.0%', '29.9%', '~31.0%','—','—'] },
      { key:'eps',  label:'EPS (EUR, GAAP)',      values:['€3.11', '€4.01', '€5.28', '€6.85', '€6.00', '~€6.25','—','—'] },
      { key:'spec', label:'Net Bookings (EUR)',   values:['€3.6B', '€5.6B', '€2.6B', '€7.1B', '€3.9B', '~€5.5B','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual (EUR). CY2025/26 = consensus (ASML guided €30–35B for 2025).',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue (EUR)',    values:['€28.3B', '~€30B',   '~€42B']   },
        { key:'revGrowth', label:'Revenue YoY',      values:['+16%',   '~+6%',    '~+40%']   },
        { key:'eps',       label:'EPS (EUR)',         values:['€19.25', '~€22',    '~€32']    },
        { key:'epsGrowth', label:'EPS YoY',          values:['+26%',   '~+14%',   '~+45%']   },
        { key:'gm',        label:'Gross Margin',     values:['~51.3%', '~52.5%',  '~54.0%']  },
        { key:'om',        label:'Op. Margin',       values:['~27.8%', '~29.5%',  '~33.0%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'€6.00', rev:'€7.7B', margin:'29.9%', surprise:'In-Line' },
    ir: 'https://www.asml.com/en/investors',
    edgarTicker: 'ASML',
    filingTypes: ['20-F'],
  },

  /* ── MSFT ────────────────────────────────────────────────────── */
  MSFT: {
    quarters: ['Q1 FY24','Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25'],
    note: 'GAAP EPS (diluted). Fiscal year ends Jun 30. Q1=Jul–Sep, Q2=Oct–Dec, Q3=Jan–Mar, Q4=Apr–Jun.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$56.5B','$62.0B','$61.9B','$64.7B','$65.6B','$69.6B','$70.1B','~$73.0B'] },
      { key:'gm',   label:'Gross Margin',        values:['71.2%', '71.0%', '69.4%', '69.6%', '69.4%', '69.7%', '68.5%', '~69.0%'] },
      { key:'om',   label:'Op. Margin',          values:['47.6%', '43.5%', '44.6%', '43.1%', '46.6%', '45.6%', '45.6%', '~45.0%'] },
      { key:'eps',  label:'EPS (GAAP)',           values:['$2.99', '$2.93', '$2.94', '$2.95', '$3.30', '$3.23', '$3.46', '~$3.24'] },
      { key:'spec', label:'Intelligent Cloud',   values:['$24.3B','$25.9B','$26.7B','$28.5B','—',    '—',    '—',    '—']    },
    ],
    estimates: {
      yearNote: 'FY2025 = actual (ended Jun 2025). FY2026/27 = Street consensus.',
      years: ['FY2025 (A)','FY2026 (E)','FY2027 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['~$278B', '~$320B',  '~$365B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['~+14%',  '~+15%',   '~+14%']   },
        { key:'eps',       label:'EPS (GAAP)',       values:['~$13.15','~$15.50', '~$18.00'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['~+15%',  '~+18%',   '~+16%']   },
        { key:'gm',        label:'Gross Margin',     values:['~69.5%', '~70.0%',  '~70.5%']  },
        { key:'om',        label:'Op. Margin',       values:['~45.4%', '~46.5%',  '~47.5%']  },
      ],
    },
    latestQ: 'Q3 FY25',
    review: { eps:'$3.46', rev:'$70.1B', margin:'45.6%', surprise:'Beat +$0.16' },
    ir: 'https://www.microsoft.com/en-us/investor',
    edgarTicker: 'MSFT',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── GOOGL ───────────────────────────────────────────────────── */
  GOOGL: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS (diluted). Calendar year.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$80.5B','$84.7B','$88.3B','$96.5B','$90.2B','~$96.4B','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['57.4%', '58.0%', '58.0%', '57.5%', '59.5%', '~59.0%', '—','—'] },
      { key:'om',   label:'Op. Margin',          values:['31.7%', '32.3%', '32.3%', '32.0%', '33.9%', '~33.5%', '—','—'] },
      { key:'eps',  label:'EPS (GAAP)',           values:['$1.89', '$1.89', '$2.12', '$2.15', '$2.81', '~$2.31', '—','—'] },
      { key:'spec', label:'Google Cloud Revenue',values:['$9.6B', '$10.4B','$11.4B','$12.0B','$12.3B','~$13.0B','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26 = Street consensus.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['$350.0B','~$400B',  '~$450B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['+14%',   '~+14%',   '~+13%']   },
        { key:'eps',       label:'EPS (GAAP)',       values:['$8.05',  '~$10.50', '~$13.00'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['+34%',   '~+30%',   '~+24%']   },
        { key:'gm',        label:'Gross Margin',     values:['~57.7%', '~59.0%',  '~59.5%']  },
        { key:'om',        label:'Op. Margin',       values:['~32.1%', '~33.5%',  '~34.5%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'$2.81', rev:'$90.2B', margin:'33.9%', surprise:'Beat +$0.80' },
    ir: 'https://abc.xyz/investor',
    edgarTicker: 'GOOGL',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── META ────────────────────────────────────────────────────── */
  META: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS (diluted). Calendar year. DAP = Daily Active People across all Meta family apps.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$36.5B','$39.1B','$40.6B','$48.4B','$42.3B','~$46.5B','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['81.0%', '81.0%', '82.0%', '82.4%', '82.5%', '~83.0%', '—','—'] },
      { key:'om',   label:'Op. Margin',          values:['37.8%', '37.9%', '41.9%', '48.3%', '41.6%', '~43.0%', '—','—'] },
      { key:'eps',  label:'EPS (GAAP)',           values:['$4.71', '$5.16', '$6.03', '$8.02', '$6.43', '~$7.78', '—','—'] },
      { key:'spec', label:'Daily Active People', values:['3.24B', '3.27B', '3.29B', '3.35B', '3.43B', '~3.49B', '—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26 = Street consensus.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['$164.5B','~$210B',  '~$255B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['+22%',   '~+28%',   '~+21%']   },
        { key:'eps',       label:'EPS (GAAP)',       values:['$23.86', '~$31.50', '~$40.00'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['+73%',   '~+32%',   '~+27%']   },
        { key:'gm',        label:'Gross Margin',     values:['~81.6%', '~82.5%',  '~83.0%']  },
        { key:'om',        label:'Op. Margin',       values:['~41.9%', '~42.5%',  '~44.0%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'$6.43', rev:'$42.3B', margin:'41.6%', surprise:'Beat +$1.18' },
    ir: 'https://investor.fb.com',
    edgarTicker: 'META',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── COIN ────────────────────────────────────────────────────── */
  COIN: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS. Net Margin includes crypto asset revaluations (mark-to-market). Gross margin not meaningful for fee-based model.',
    metrics: [
      { key:'rev',  label:'Revenue',             values:['$1.64B','$1.45B','$1.21B','$2.27B','~$2.0B', '—','—','—'] },
      { key:'gm',   label:'Gross Margin',        values:['—',    '—',    '—',    '—',    '—',    '—','—','—'] },
      { key:'om',   label:'Net Margin',          values:['71.9%','2.8%', '5.8%', '56.8%','~35%', '—','—','—'] },
      { key:'eps',  label:'EPS (GAAP, diluted)', values:['$2.66', '$0.09', '$0.28', '$4.68', '~$3.25','—','—','—'] },
      { key:'spec', label:'Trading Volume',      values:['$312B', '$226B', '$185B', '$439B', '~$394B','—','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26 = wide consensus range (crypto-cycle dependent).',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Revenue',         values:['$6.57B', '~$6-9B',   '~$8-12B']  },
        { key:'revGrowth', label:'Revenue YoY',      values:['+108%',  'variable', 'variable'] },
        { key:'eps',       label:'EPS (GAAP)',       values:['$7.71',  'variable', 'variable'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['N/M',    'variable', 'variable'] },
        { key:'gm',        label:'Gross Margin',     values:['—',      '—',        '—']        },
        { key:'om',        label:'Net Margin',       values:['~34%',   'variable', 'variable'] },
      ],
    },
    latestQ: 'Q4 2024',
    review: { eps:'$4.68', rev:'$2.27B', margin:'56.8%', surprise:'Beat +$1.50' },
    ir: 'https://investor.coinbase.com',
    edgarTicker: 'COIN',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── JPM ─────────────────────────────────────────────────────── */
  JPM: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS. Net Revenue = managed net revenue. Q2 2024 elevated by Visa exchange gain. NII = Net Interest Income.',
    metrics: [
      { key:'rev',  label:'Net Revenue',          values:['$41.9B','$50.2B','$43.3B','$43.7B','~$45.3B','—','—','—'] },
      { key:'gm',   label:'Net Margin',           values:['32.0%', '36.0%', '29.8%', '32.0%', '~30.0%', '—','—','—'] },
      { key:'om',   label:'Return on Equity',     values:['17.0%', '28.0%', '16.0%', '17.0%', '~16.0%', '—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$4.44', '$6.12', '$4.37', '$4.81', '~$5.07', '—','—','—'] },
      { key:'spec', label:'Net Interest Income',  values:['$23.1B','$22.9B','$23.5B','$23.9B','~$24.0B','—','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26 = Street consensus. NII sensitive to Fed rate path.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Net Revenue',     values:['$179.1B','~$175B',  '~$180B']   },
        { key:'revGrowth', label:'Revenue YoY',      values:['+10%',   '~-2%',    '~+3%']    },
        { key:'eps',       label:'EPS (GAAP)',       values:['$19.74', '~$19.00', '~$21.00'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['N/M',    '~-4%',    '~+10%']   },
        { key:'gm',        label:'Net Margin',       values:['~32.5%', '~30.0%',  '~30.5%']  },
        { key:'om',        label:'Return on Equity', values:['~17%',   '~15.5%',  '~16.0%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'~$5.07', rev:'~$45.3B', margin:'~16.0%', surprise:'Beat +$0.30' },
    ir: 'https://www.jpmorganchase.com/ir',
    edgarTicker: 'JPM',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── GS ──────────────────────────────────────────────────────── */
  GS: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'GAAP EPS. Net Revenue = total net revenue. Trading Revenue = Global Banking & Markets (FICC + Equities combined).',
    metrics: [
      { key:'rev',  label:'Net Revenue',          values:['$14.2B','$12.7B','$12.7B','$13.9B','~$15.7B','—','—','—'] },
      { key:'gm',   label:'Net Margin',           values:['26.9%', '22.4%', '21.8%', '28.3%', '~28.0%', '—','—','—'] },
      { key:'om',   label:'Return on Equity',     values:['14.8%', '10.9%', '10.4%', '12.6%', '~14.5%', '—','—','—'] },
      { key:'eps',  label:'EPS (GAAP)',            values:['$11.58','$8.62', '$8.40', '$11.95','~$14.12','—','—','—'] },
      { key:'spec', label:'Trading Revenue',      values:['$8.3B', '$7.2B', '$7.5B', '$7.6B', '~$9.5B', '—','—','—'] },
    ],
    estimates: {
      yearNote: 'CY2024 = actual. CY2025/26 = Street consensus. IB pipeline recovery key driver.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Net Revenue',     values:['$53.5B', '~$62B',   '~$68B']   },
        { key:'revGrowth', label:'Revenue YoY',      values:['+16%',   '~+16%',   '~+10%']   },
        { key:'eps',       label:'EPS (GAAP)',       values:['$40.55', '~$51.00', '~$58.00'] },
        { key:'epsGrowth', label:'EPS YoY',          values:['N/M',    '~+26%',   '~+14%']   },
        { key:'gm',        label:'Net Margin',       values:['~24.8%', '~27.0%',  '~27.5%']  },
        { key:'om',        label:'Return on Equity', values:['~12.2%', '~14.0%',  '~15.0%']  },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'~$14.12', rev:'~$15.7B', margin:'~14.5%', surprise:'Beat +$2.60' },
    ir: 'https://www.gs.com/investor-relations',
    edgarTicker: 'GS',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── MSTR ────────────────────────────────────────────────────── */
  MSTR: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'Now branded "Strategy." Software revenue = legacy analytics business. BTC Yield = company-defined KPI (change in BTC per diluted share). EPS highly volatile due to BTC mark-to-market under ASC 350-60.',
    metrics: [
      { key:'rev',  label:'Software Revenue',     values:['$115M', '$111M', '$116M', '$121M', '$111M','—','—','—'] },
      { key:'gm',   label:'Software Gross Margin',values:['74.0%', '73.0%', '74.0%', '75.0%', '73.0%','—','—','—'] },
      { key:'om',   label:'BTC Holdings (qty)',   values:['214,246','226,331','252,220','446,400','~528K','—','—','—'] },
      { key:'eps',  label:'BTC Holdings ($B)',     values:['~$15B', '~$14B', '~$16B', '~$41B',  '~$43B','—','—','—'] },
      { key:'spec', label:'BTC Yield (quarter)',  values:['~4.4%', '~5.1%', '~5.5%', '~48.0%','~11.0%','—','—','—'] },
    ],
    estimates: {
      yearNote: 'Traditional EPS estimates not meaningful — driven by BTC mark-to-market. Software revenue declining. BTC holdings are key metric.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'Software Revenue', values:['$463M',  '~$425M',  '~$400M'] },
        { key:'revGrowth', label:'Revenue YoY',       values:['-7%',    '~-8%',    '~-6%']   },
        { key:'eps',       label:'EPS (GAAP)',        values:['N/M',    'N/M',     'N/M']    },
        { key:'epsGrowth', label:'EPS YoY',           values:['N/M',    'N/M',     'N/M']    },
        { key:'gm',        label:'BTC Holdings (E)',  values:['~446K',  '~700K+',  '—']      },
        { key:'om',        label:'BTC Yield Target',  values:['~74%',   '~25%+',   '—']      },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'N/M', rev:'$111M', margin:'73.0%', surprise:'N/A — BTC-driven' },
    ir: 'https://www.microstrategy.com/investor-relations',
    edgarTicker: 'MSTR',
    filingTypes: ['10-K','10-Q'],
  },

  /* ── IBIT ────────────────────────────────────────────────────── */
  IBIT: {
    quarters: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
    note: 'iShares Bitcoin Trust ETF — launched Jan 11, 2024. No earnings. All data as of quarter-end. Expense ratio: 0.25%. Source: BlackRock / iShares.com.',
    metrics: [
      { key:'rev',  label:'AUM (end of qtr)',      values:['~$23B', '~$18B', '~$23B', '~$52B', '~$47B','—','—','—'] },
      { key:'gm',   label:'BTC Holdings (qty)',    values:['~320K', '~287K', '~352K', '~561K', '~570K','—','—','—'] },
      { key:'om',   label:'BTC Price (end of qtr)',values:['~$71K', '~$61K', '~$64K', '~$93K', '~$82K','—','—','—'] },
      { key:'eps',  label:'NAV per Share (~)',      values:['~$37',  '~$32',  '~$33',  '~$49',  '~$42', '—','—','—'] },
      { key:'spec', label:'Net Inflows (quarter)', values:['~$14B', '~-$0.5B','~$4B', '~$19B', '~$5B', '—','—','—'] },
    ],
    estimates: {
      yearNote: 'No traditional financial estimates. AUM and flows depend entirely on BTC price and market sentiment.',
      years: ['CY2024 (A)','CY2025 (E)','CY2026 (E)'],
      rows: [
        { key:'rev',       label:'AUM (year-end)',   values:['~$52B',  '~$50-80B','—']       },
        { key:'revGrowth', label:'Net Inflows',       values:['~$37B',  '~$10-30B','—']       },
        { key:'eps',       label:'NAV per Share',     values:['~$49',   'BTC-dep.','—']       },
        { key:'epsGrowth', label:'BTC Return',        values:['~+121%', '—',       '—']       },
        { key:'gm',        label:'Expense Ratio',     values:['0.25%',  '0.25%',   '0.25%']  },
        { key:'om',        label:'Shares Outstanding',values:['~1.08B', '—',       '—']       },
      ],
    },
    latestQ: 'Q1 2025',
    review: { eps:'~$42 NAV', rev:'~$47B AUM', margin:'N/A', surprise:'N/A — ETF' },
    ir: 'https://www.blackrock.com/us/individual/products/333011',
    edgarTicker: 'IBIT',
    filingTypes: ['N-'],
  },

};
