const express = require("express");
const cors = require("cors");
const axios = require("axios");

const API_KEY = process.env.ALPHA_VANTAGE_KEY;

async function getNifty() {
    const r = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NIFTYBEES.BSE&apikey=${API_KEY}`
    );

    return r.data["Global Quote"]["05. price"];
}

async function getUSD() {
    const r = await axios.get(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${API_KEY}`
    );

    return r.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
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
    try {
        const [nifty, usd] =
            await Promise.all([
                getNifty(),
                getUSD()
            ]);

        res.json({
            nifty,
            sensex: nifty,
            banknifty: nifty,
            usd,
            gold: "9800"
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
