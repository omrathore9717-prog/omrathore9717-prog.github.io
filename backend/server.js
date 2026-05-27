require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const API_KEY =
    process.env.ALPHA_VANTAGE_KEY || "9I968M86SOD41OY3";

async function getNifty() {
    try {
        const r = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NIFTYBEES.BSE&apikey=${API_KEY}`
        );

        console.log(
            JSON.stringify(r.data, null, 2)
        );

        return r.data;
    } catch (e) {
        console.error(e);
        return e;
    }
}

async function getUSD() {
    try {
        const r = await axios.get(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${API_KEY}`
        );

        return (
            r.data[
                "Realtime Currency Exchange Rate"
            ]?.["5. Exchange Rate"]
            || "85.5"
        );
    } catch {
        return "85.5";
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
    const data =
        await getNifty();

    res.json(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
