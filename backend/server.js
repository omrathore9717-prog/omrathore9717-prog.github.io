const express = require("express");
const cors = require("cors");
const axios = require("axios");

async function getPrice(symbol) {
    try {
        const url =
            `https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcvn&e=json`;

        const r = await axios.get(url);

        return r.data?.symbols?.[0]?.close || "--";
    } catch (e) {
        return "--";
    }
}

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
    const [nifty, sensex, bank] = await Promise.all([
        getPrice("nsei"),
        getPrice("sensex"),
        getPrice("banknifty")
    ]);

    res.json({
        nifty,
        sensex,
        banknifty: bank,
        usd: "LIVE",
        gold: "LIVE"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
