import { useMarketData } from "../hooks/useMarketData";
import { CurrencyCard } from "./CurrencyCard";

export function CurrencyList() {
  const { marketData, connectionStatus } = useMarketData();
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {marketData.map((currency) => (
        <CurrencyCard key={currency.symbol} currency={currency} />
      ))}
    </div>
  );
}

export default CurrencyList;
