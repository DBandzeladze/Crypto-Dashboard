import { useMarketData } from "../hooks/useMarketData";

export function TestCurrencyComponent() {
  const marketData = useMarketData();
  return (
    <div className="p-4 flex flex-col gap-2 border rounded-md">
      {marketData.map((currency) => (
        <div key={currency.symbol}>
          <p>
            {currency.symbol}: {currency.currentPrice}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TestCurrencyComponent;
