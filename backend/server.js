const express = require("express");
const cors = require("cors");
const axios = require("axios");

const client = axios.create({
    headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    }
});

async function getNSE() {
    await client.get(
        "https://www.nseindia.com",
        {
            headers: {
                referer: "https://www.nseindia.com/"
            }
        }
    );

    const r = await client.get(
        "https://www.nseindia.com/api/allIndices"
    );

    const data = r.data.data;

    const nifty =
        data.find(x => x.index === "NIFTY 50");

    const bank =
        data.find(
            x => x.index === "NIFTY BANK"
        );

    return {
        nifty: nifty.last,
        banknifty: bank.last
    };
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
        const nse =
            await getNSE();

        res.json({
            nifty: nse.nifty,
            sensex: nse.nifty,
            banknifty: nse.banknifty,
            usd: "85.5",
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
