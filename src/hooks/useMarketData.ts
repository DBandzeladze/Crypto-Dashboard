import { useEffect, useRef, useState } from "react";
import type {
  BinanceTickerMessage,
  ConnectionStatus,
  MarketCurrency,
  SupportedSymbol,
  PriceAlert,
} from "../types/market";

import { isSupportedSymbol } from "../types/market";

const currencyInfo: Record<SupportedSymbol, { name: string }> = {
  BTCUSDT: { name: "Bitcoin" },
  ETHUSDT: { name: "Ethereum" },
  SOLUSDT: { name: "Solana" },
  BNBUSDT: { name: "BNB" },
  XRPUSDT: { name: "XRP" },
};

type props = {
  threshold: number;
  haveThresholdchange: React.Dispatch<React.SetStateAction<number>>;
  favoriteMap: Record<string, boolean>;
};
export function useMarketData({
  threshold,
  haveThresholdchange,
  favoriteMap,
}: props) {
  console.log(threshold, "entered");
  const [marketData, setMarketData] = useState<MarketCurrency[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [priceAlert, setPriceAlert] = useState<PriceAlert>();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);
  const initialPricesRef = useRef<Record<string, number>>({});
  const thresholdFlagsRef = useRef<
    Record<string, { upper: boolean; lower: boolean }>
  >({});
  function handlePriceAlert(
    symbol: string,
    name: string,
    initialPrice: number,
    currentPrice: number,
    threshold: number,
  ) {
    const { upper, lower } = thresholdFlagsRef.current[symbol];
    const percentageChange =
      ((currentPrice - initialPrice) / initialPrice) * 100;
    console.log(threshold, "inside function");
    if (Math.abs(percentageChange) < threshold) {
      thresholdFlagsRef.current[symbol] = { upper: false, lower: false };
    } else {
      if (percentageChange >= threshold && upper === false) {
        thresholdFlagsRef.current[symbol] = { upper: true, lower: false };
        setPriceAlert({
          symbol,
          name,
          initialPrice,
          currentPrice,
          percentageChange,
          direction: "up",
        });
      }
      if (percentageChange <= -threshold && lower === false) {
        thresholdFlagsRef.current[symbol] = { upper: false, lower: true };
        setPriceAlert({
          symbol,
          name,
          initialPrice,
          currentPrice,
          percentageChange,
          direction: "down",
        });
      }
    }
  }
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
      console.log("wasClean:", event.wasClean);
      console.log("shouldReconnect:", shouldReconnectRef.current);
      if (shouldReconnectRef.current && event.wasClean === false) {
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
      try {
        const data: BinanceTickerMessage = JSON.parse(event.data);
        if (data && data.data) {
          const { s: symbol, c: rawCurrentPrice } = data.data;
          const currentPrice = parseFloat(rawCurrentPrice);
          if (isSupportedSymbol(symbol)) {
            const name = currencyInfo[symbol].name;
            if (initialPricesRef.current[symbol] === undefined) {
              initialPricesRef.current[symbol] = currentPrice;
              thresholdFlagsRef.current[symbol] = {
                upper: false,
                lower: false,
              };
            } else {
              (console.log(threshold), "before hande");
              if (favoriteMap[symbol]) {
                handlePriceAlert(
                  symbol,
                  name,
                  initialPricesRef.current[symbol],
                  currentPrice,
                  threshold,
                );
              }
            }
            setMarketData((prevData) => {
              const existingCurrency = prevData.find(
                (currency) => currency.symbol === symbol,
              );
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
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
        setConnectionStatus("error");
      }
    };
  }
  useEffect(() => {
    console.log(threshold, "inside useEffect");
    connect();
    favoriteMap;
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
  }, [threshold, favoriteMap]);
  return {
    marketData,
    connectionStatus,
    priceAlert,
  };
}
