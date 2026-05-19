/* ── App configuration ─────────────────────────────────────────────
   API keys are stored in localStorage (never in this file).
   Enter them at settings.html. They persist across page loads.
   ─────────────────────────────────────────────────────────────── */

const WATCHLIST = ['NVDA', 'MSFT', 'COIN', 'GOOGL', 'AMD', 'CRWD', 'GS'];

const COMPANY_NAMES = {
  NVDA:  'NVIDIA Corporation',
  MSFT:  'Microsoft Corporation',
  COIN:  'Coinbase Global Inc.',
  GOOGL: 'Alphabet Inc.',
  AMD:   'Advanced Micro Devices',
  CRWD:  'CrowdStrike Holdings',
  GS:    'Goldman Sachs Group',
};

const COMPANY_SECTORS = {
  NVDA:  'Semiconductors',
  MSFT:  'Cloud / Software',
  COIN:  'Crypto / Fintech',
  GOOGL: 'Internet / Cloud',
  AMD:   'Semiconductors',
  CRWD:  'Cybersecurity',
  GS:    'Investment Banking',
};

const FMP_BASE = 'https://financialmodelingprep.com/api/v3';
const AV_BASE  = 'https://www.alphavantage.co/query';

function getKeys() {
  return {
    fmp: localStorage.getItem('fmp_key') || '',
    av:  localStorage.getItem('av_key')  || '',
  };
}

function hasKey(name) { return !!getKeys()[name]; }
