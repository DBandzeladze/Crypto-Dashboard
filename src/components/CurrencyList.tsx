import type { MarketCurrency } from "../types/market";
import { CurrencyCard } from "./CurrencyCard";

type CurrencyListProps = {
  marketData: MarketCurrency[];
  onFavoriteChange: (symbol: string) => void;
  favoriteMap: Record<string, boolean>;
};

export function CurrencyList({
  marketData,
  onFavoriteChange,
  favoriteMap,
}: CurrencyListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {marketData.map((currency) => (
        <CurrencyCard
          key={currency.symbol}
          currency={currency}
          isFavorite={favoriteMap[currency.symbol]}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
}

export default CurrencyList;
