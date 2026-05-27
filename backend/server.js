const express = require("express");
const cors = require("cors");
const axios = require("axios");

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

app.get("/api/market", (req, res) => {
    const { execFile } = require('child_process');
    const py = process.env.PYTHON || 'python';
    const script = __dirname + '/market_service.py';

    execFile(py, [script], { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) {
            console.error('Market service error', err, stderr);
            // fallback to placeholder
            return res.json({
                nifty: "LIVE",
                sensex: "LIVE",
                banknifty: "LIVE",
                usd: "LIVE",
                gold: "LIVE"
            });
        }

        try {
            const parsed = JSON.parse(stdout);
            // if parsed contains success/data shape (when run as FastAPI client it won't), handle both
            if (parsed && parsed.success && parsed.data) {
                return res.json(parsed.data);
            }
            // CLI mode returns the raw dict
            return res.json(parsed);
        } catch (parseErr) {
            console.error('Failed to parse market output', parseErr);
            return res.json({
                nifty: "LIVE",
                sensex: "LIVE",
                banknifty: "LIVE",
                usd: "LIVE",
                gold: "LIVE"
            });
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
