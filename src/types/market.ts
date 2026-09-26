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
