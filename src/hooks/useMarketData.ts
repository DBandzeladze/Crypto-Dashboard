import { useEffect, useRef, useState } from "react";
import type {
  BinanceTickerMessage,
  ConnectionStatus,
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
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);
  function connect() {
    wsRef.current = new WebSocket(
      "wss://fstream.binance.com/market/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker",
    );
    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("connected");
    };
    wsRef.current.onclose = (event) => {
      console.log(
        `WebSocket connection closed: ${event.code} - ${event.reason}`,
      );
      if (event.wasClean === false) {
        console.log("Attempting to reconnect in 5 seconds...");
        setConnectionStatus("reconnecting");
        reconnectTimerRef.current = setTimeout(() => {
          reconnectTimerRef.current = null;

          if (shouldReconnectRef.current) {
            connect();
          }
        }, 5000);
      } else {
        setConnectionStatus("disconnected");
      }
    };
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };
    wsRef.current.onmessage = (event) => {
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
  }
  useEffect(() => {
    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, []);
  return {
    marketData,
    connectionStatus,
  };
}
