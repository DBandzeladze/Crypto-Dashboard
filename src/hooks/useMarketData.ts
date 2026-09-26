import { useEffect, useState } from "react";
import type {
  BinanceTickerMessage,
  MarketCurrency,
  SupportedSymbol,
} from "../types/market";

import { isSupportedSymbol } from "../types/market";

const currencyInfo: Record<SupportedSymbol, { name: string }> = {
  BTCUSDT: { name: "Bitcoin" },
  ETHUSDT: { name: "Ethereum" },
  SOLUSDT: { name: "Solana" },
  BNBUSDT: { name: "BNB" },
  XRPUSDT: { name: "XRP" },
};

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketCurrency[]>([]);
  useEffect(() => {
    const ws = new WebSocket(
      "wss://fstream.binance.com/market/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker",
    );
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
    ws.onclose = (event) => {
      console.log(
        `WebSocket connection closed: ${event.code} - ${event.reason}`,
      );
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      const data: BinanceTickerMessage = JSON.parse(event.data);
      if (data && data.data) {
        console.log("Received data:", data);
        const { s: symbol, c: rawCurrentPrice } = data.data;
        const currentPrice = parseFloat(rawCurrentPrice);
        console.log(`Symbol: ${symbol}, Current Price: ${currentPrice}`);
        if (isSupportedSymbol(symbol)) {
          const name = currencyInfo[symbol].name;
          setMarketData((prevData) => {
            const existingCurrency = prevData.find(
              (currency) => currency.symbol === symbol,
            );
            console.log("Existing currency:", existingCurrency);
            if (existingCurrency) {
              const previousPrice = existingCurrency.currentPrice;
              const priceDirection =
                currentPrice > previousPrice
                  ? "up"
                  : currentPrice < previousPrice
                    ? "down"
                    : "unchanged";
              return prevData.map((currency) =>
                currency.symbol === symbol
                  ? {
                      ...currency,
                      name,
                      currentPrice,
                      previousPrice,
                      priceDirection,
                    }
                  : currency,
              );
            } else {
              return [
                ...prevData,
                {
                  symbol,
                  name,
                  currentPrice,
                  previousPrice: currentPrice,
                  priceDirection: "unchanged",
                },
              ];
            }
          });
        }
      }
    };

    return () => {
      ws.close();
    };
  }, []);
  return marketData;
}
