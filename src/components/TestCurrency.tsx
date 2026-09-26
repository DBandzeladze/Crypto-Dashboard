import { useMarketData } from "../hooks/useMarketData";
import { CurrencyCard } from "./CurrencyCard";

export function TestCurrencyComponent() {
  const marketData = useMarketData();
  return (
    <div className="p-4 flex flex-col gap-2 border rounded-md">
      {marketData.map((currency) => (
        <CurrencyCard key={currency.symbol} currency={currency} />
      ))}
    </div>
  );
}

export default TestCurrencyComponent;
