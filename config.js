/* ── App configuration ─────────────────────────────────────────────
   No API keys required — Yahoo Finance accessed via allorigins proxy.
   ─────────────────────────────────────────────────────────────── */

const SECTORS = {
  'Semis/AI':       ['NVDA', 'AMD', 'TSMC', 'ASML'],
  'Software/Cloud': ['MSFT', 'GOOGL', 'META'],
  'FIG/Crypto':     ['COIN', 'JPM', 'GS', 'MSTR', 'IBIT'],
};

const WATCHLIST = Object.values(SECTORS).flat();

const COMPANY_NAMES = {
  NVDA:  'NVIDIA Corporation',
  AMD:   'Advanced Micro Devices',
  TSMC:  'Taiwan Semiconductor',
  ASML:  'ASML Holding',
  MSFT:  'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  META:  'Meta Platforms Inc.',
  COIN:  'Coinbase Global Inc.',
  JPM:   'JPMorgan Chase & Co.',
  GS:    'Goldman Sachs Group',
  MSTR:  'MicroStrategy Inc. (Strategy)',
  IBIT:  'iShares Bitcoin Trust ETF',
};

const TICKER_SECTOR = {};
Object.entries(SECTORS).forEach(([s, tickers]) => tickers.forEach(t => TICKER_SECTOR[t] = s));

function sectorClass(sector) {
  return sector === 'Semis/AI' ? 'semis' : sector === 'Software/Cloud' ? 'software' : 'fig';
}
