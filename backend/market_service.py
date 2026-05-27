#!/usr/bin/env python
import json
import yfinance as yf
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

def get_market():
    try:
        return {
            "nifty": round(yf.Ticker("^NSEI").history(period="1d")["Close"].iloc[-1], 2),
            "sensex": round(yf.Ticker("^BSESN").history(period="1d")["Close"].iloc[-1], 2),
            "banknifty": round(yf.Ticker("^NSEBANK").history(period="1d")["Close"].iloc[-1], 2),
            "usd": round(yf.Ticker("INR=X").history(period="1d")["Close"].iloc[-1], 2),
            "gold": round(yf.Ticker("GC=F").history(period="1d")["Close"].iloc[-1], 2)
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/market")
def market_route():
    data = get_market()
    if data is None:
        return JSONResponse({"success": False, "error": "No market data"}, status_code=500)
    if "error" in data:
        return JSONResponse({"success": False, "error": data["error"]}, status_code=500)
    return JSONResponse({"success": True, "data": data})


if __name__ == '__main__':
    # CLI mode: print JSON to stdout for invocation by other processes
    print(json.dumps(get_market()))
