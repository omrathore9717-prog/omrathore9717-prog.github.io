require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MF_API_URL = process.env.MF_API_URL || 'https://api.mfapi.in/mf';
const MARKET_API_URL = process.env.MARKET_API_URL || 'https://query1.finance.yahoo.com/v8/finance/chart';
const MARKET_CACHE_TTL_MS = Number(process.env.MARKET_CACHE_TTL_MS || 30000);
const FUNDS_CACHE_TTL_MS = Number(process.env.FUNDS_CACHE_TTL_MS || 3600000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(origin => origin.trim()) }));
app.use(express.json());

let fundsCache = { timestamp: 0, data: [] };
let marketCache = { timestamp: 0, data: null };

function isFresh(cache, ttl) {
    return cache.data && Date.now() - cache.timestamp < ttl;
}

function classifyFund(name = '') {
    const value = name.toLowerCase();
    if(value.includes('large cap') || value.includes('bluechip') || value.includes('blue chip')) return 'Large Cap';
    if(value.includes('mid cap') || value.includes('midcap')) return 'Mid Cap';
    if(value.includes('small cap') || value.includes('smallcap')) return 'Small Cap';
    if(value.includes('elss') || value.includes('tax saver') || value.includes('tax saving')) return 'ELSS';
    if(value.includes('hybrid') || value.includes('balanced') || value.includes('asset allocation')) return 'Hybrid';
    if(value.includes('debt') || value.includes('liquid') || value.includes('gilt') || value.includes('bond') || value.includes('income')) return 'Debt Funds';
    return 'Other';
}

function normalizeFund(scheme) {
    const name = scheme.schemeName || 'Mutual Fund Scheme';
    const category = classifyFund(name);
    return {
        code: scheme.schemeCode,
        name,
        category,
        returns: 'Live scheme',
        aum: `Code ${scheme.schemeCode}`,
        description: `${category === 'Other' ? 'Mutual fund' : category} scheme from live MFAPI data.`
    };
}

async function fetchYahooQuote(symbol) {
    const response = await axios.get(`${MARKET_API_URL}/${encodeURIComponent(symbol)}`, {
        timeout: 8000,
        params: {
            interval: '1d',
            range: '5d'
        }
    });
    const result = response.data?.chart?.result?.[0];
    const meta = result?.meta || {};
    const previousClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice || 0;
    const current = meta.regularMarketPrice || result?.indicators?.quote?.[0]?.close?.filter(Boolean).at(-1) || previousClose;
    const amount = current - previousClose;
    const percent = previousClose ? (amount / previousClose) * 100 : 0;

    return {
        value: current,
        amount,
        percent,
        currency: meta.currency || ''
    };
}

function formatNumber(value, options = {}) {
    if(typeof value !== 'number' || Number.isNaN(value)) return '--';
    return value.toLocaleString('en-IN', options);
}

function formatMarketValue(id, quote) {
    if(id === 'USDINR') return `\u20b9${formatNumber(quote.value, { maximumFractionDigits: 2 })}`;
    if(id === 'GOLD') return `$${formatNumber(quote.value, { maximumFractionDigits: 2 })}`;
    return formatNumber(quote.value, { maximumFractionDigits: 2 });
}

function formatMarketChange(quote) {
    const sign = quote.amount >= 0 ? '+' : '';
    return `${sign}${formatNumber(quote.amount, { maximumFractionDigits: 2 })} (${sign}${formatNumber(quote.percent, { maximumFractionDigits: 2 })}%)`;
}

async function getMarketData() {
    const symbols = {
        NIFTY50: '^NSEI',
        SENSEX: '^BSESN',
        BANKNIFTY: '^NSEBANK',
        USDINR: 'INR=X',
        GOLD: 'GC=F'
    };

    const entries = await Promise.all(
        Object.entries(symbols).map(async ([id, symbol]) => {
            const quote = await fetchYahooQuote(symbol);
            return [id, {
                id,
                symbol,
                value: formatMarketValue(id, quote),
                change: formatMarketChange(quote),
                raw: {
                    value: quote.value,
                    amount: quote.amount,
                    percent: quote.percent
                }
            }];
        })
    );

    return Object.fromEntries(entries);
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/funds', async (req, res) => {
    try {
        if(isFresh(fundsCache, FUNDS_CACHE_TTL_MS)) {
            return res.json({ data: fundsCache.data, cached: true });
        }

        const response = await axios.get(MF_API_URL, { timeout: 15000 });
        const data = Array.isArray(response.data) ? response.data.map(normalizeFund) : [];
        fundsCache = { timestamp: Date.now(), data };

        res.json({ data, cached: false });
    } catch (error) {
        console.error('Funds fetch failed:', error.message);
        if(fundsCache.data.length) {
            return res.json({ data: fundsCache.data, cached: true, stale: true });
        }
        res.status(502).json({ error: 'Unable to fetch mutual fund data.' });
    }
});

app.get('/api/market', async (req, res) => {
    try {
        if(isFresh(marketCache, MARKET_CACHE_TTL_MS)) {
            return res.json({ data: marketCache.data, cached: true });
        }

        const data = await getMarketData();
        marketCache = { timestamp: Date.now(), data };

        res.json({ data, cached: false });
    } catch (error) {
        console.error('Market fetch failed:', error.message);
        if(marketCache.data) {
            return res.json({ data: marketCache.data, cached: true, stale: true });
        }
        res.status(502).json({ error: 'Unable to fetch market data.' });
    }
});

app.listen(PORT, () => {
    console.log(`OM Financial Service API running on port ${PORT}`);
});
