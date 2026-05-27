#!/usr/bin/env python
import json
import yfinance as yf
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

def get_price(symbol):
    try:
        data = yf.Ticker(symbol).history(period="1d")

        if data.empty:
            return "--"

        return round(float(data["Close"].iloc[-1]),2)

    except:
        return "--"

def get_market():
    return {
        "nifty": get_price("^NSEI"),
        "sensex": get_price("^BSESN"),
        "banknifty": get_price("^NSEBANK"),
        "usd": get_price("INR=X"),
        "gold": get_price("GC=F")
    }


@app.get("/api/market")
def market_route():
    return JSONResponse(get_market())


if __name__ == '__main__':
    # CLI mode: print JSON to stdout for invocation by other processes
    print(json.dumps(get_market()))
