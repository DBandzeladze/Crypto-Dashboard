import type { MarketCurrency } from "../types/market";
import { CurrencyCard } from "./CurrencyCard";

type CurrencyListProps = {
  marketData: MarketCurrency[];
  onFavoriteChange: (symbol: string) => void;
  favoriteMap: Record<string, boolean>;
  onHiddenChange: (symbol: string) => void;
  hiddenMap: Record<string, boolean>;
};

export function CurrencyList({
  marketData,
  onFavoriteChange,
  favoriteMap,
  onHiddenChange,
  hiddenMap,
}: CurrencyListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {marketData.map((currency) => (
        <CurrencyCard
          key={currency.symbol}
          currency={currency}
          isFavorite={favoriteMap[currency.symbol]}
          onFavoriteChange={onFavoriteChange}
          isHidden={hiddenMap[currency.symbol]}
          onHiddenChange={onHiddenChange}
        />
      ))}
    </div>
  );
}

