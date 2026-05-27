const express = require("express");
const cors = require("cors");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;

const app = express();

app.use(cors({
    origin: [
        "https://omfinancialservice.com",
        "https://www.omfinancialservice.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ]
}));

app.get("/", (req, res) => {
    res.send("OM Financial Service API LIVE");
});

app.get("/api/funds", async (req, res) => {
    try {
        const response = await axios.get("https://api.mfapi.in/mf");
        const data = response.data || [];

        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.get("/api/market", async (req, res) => {
    try {
        const nifty = await yahooFinance.quote("^NSEI");
        const sensex = await yahooFinance.quote("^BSESN");
        const bank = await yahooFinance.quote("^NSEBANK");
        const usd = await yahooFinance.quote("INR=X");
        const gold = await yahooFinance.quote("GC=F");

        res.json({
            nifty: nifty.regularMarketPrice,
            sensex: sensex.regularMarketPrice,
            banknifty: bank.regularMarketPrice,
            usd: usd.regularMarketPrice,
            gold: gold.regularMarketPrice
        });
    } catch (err) {
        console.error("Market fetch failed", err);
        res.status(500).json({
            error: "market fetch failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
