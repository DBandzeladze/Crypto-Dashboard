export type BinanceTickerMessage = {
  data: {
    s: string;
    c: string;
  };
};

export type BinanceCurrency = {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  priceDirection: PriceDirection;
};

export type PriceDirection = "up" | "down" | "unchanged";

export type MarketCurrency = BinanceCurrency & {
  name: string;
};

const SUPPORTED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
] as const;

export type SupportedSymbol = (typeof SUPPORTED_SYMBOLS)[number];

export function isSupportedSymbol(symbol: string): symbol is SupportedSymbol {
  return SUPPORTED_SYMBOLS.includes(symbol as SupportedSymbol);
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export type SortOption = "name" | "currentPrice" | "priceChange";
export type SortDirection = "asc" | "desc";
export type ActiveView = "all" | "favorites";

export type PriceAlert = {
  symbol: string;
  name: string;
  initialPrice: number;
  currentPrice: number;
  percentageChange: number;
  direction: "up" | "down";
};
