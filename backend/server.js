const express = require("express");
const cors = require("cors");

const app = express();

const marketData = {
    nifty: { value: "22,500", change: "Reference value", raw: { amount: 0 } },
    sensex: { value: "74,000", change: "Reference value", raw: { amount: 0 } },
    banknifty: { value: "48,200", change: "Reference value", raw: { amount: 0 } },
    usd: { value: "83.30", change: "Reference value", raw: { amount: 0 } },
    gold: { value: "2,350", change: "Reference value", raw: { amount: 0 } }
};

const funds = [
    {
        name: "OM Bluechip Growth",
        category: "Large Cap",
        description: "Large-cap focused fund example for long-term equity allocation.",
        returns: "14.8%",
        aum: "Rs 8,500 Cr"
    },
    {
        name: "OM Emerging Leaders",
        category: "Mid Cap",
        description: "Mid-cap fund example for investors seeking higher growth potential.",
        returns: "17.2%",
        aum: "Rs 4,200 Cr"
    },
    {
        name: "OM Small Cap Opportunities",
        category: "Small Cap",
        description: "Small-cap fund example for aggressive long-term investors.",
        returns: "19.1%",
        aum: "Rs 2,100 Cr"
    },
    {
        name: "OM Tax Saver Equity",
        category: "ELSS",
        description: "ELSS example for tax-saving oriented equity investing.",
        returns: "13.5%",
        aum: "Rs 3,800 Cr"
    },
    {
        name: "OM Balanced Advantage",
        category: "Hybrid",
        description: "Hybrid fund example balancing equity growth and debt stability.",
        returns: "11.4%",
        aum: "Rs 6,700 Cr"
    },
    {
        name: "OM Short Duration Fund",
        category: "Debt Funds",
        description: "Debt fund example for conservative short-to-medium term goals.",
        returns: "7.1%",
        aum: "Rs 5,600 Cr"
    }
];

app.use(cors({
    origin: [
        "https://omfinancialservice.com",
        "https://www.omfinancialservice.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ]
}));

app.get("/", (req, res) => {
    res.send("OM Financial Service API running with static data");
});

app.get("/api/funds", (req, res) => {
    res.json({
        success: true,
        source: "static",
        data: funds
    });
});

app.get("/api/market", (req, res) => {
    res.json({
        success: true,
        source: "static",
        data: marketData
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("OM Financial Service API running on port", PORT);
});
