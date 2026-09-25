import { useEffect, useState } from "react";
import type { MarketCurrency } from "../types/market";

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
      const data = JSON.parse(event.data);
      if (data && data.data) {
        console.log("Received data:", data);
        const { s: symbol, c: rawCurrentPrice } = data.data;
        const currentPrice = parseFloat(rawCurrentPrice);
        console.log(`Symbol: ${symbol}, Current Price: ${currentPrice}`);
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
                ? { ...currency, currentPrice, previousPrice, priceDirection }
                : currency,
            );
          } else {
            return [
              ...prevData,
              {
                symbol,
                currentPrice,
                previousPrice: currentPrice,
                priceDirection: "unchanged",
              },
            ];
          }
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);
  return marketData;
}
