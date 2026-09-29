import type { MarketCurrency } from "@/types/market";
import { CurrencySelector } from "./CurrencySelector";
import { useState, type ChangeEvent } from "react";
import { Icon } from "@iconify/react";

type CurrencyExchangeProps = {
  marketData: MarketCurrency[];
};

export function CurrencyExchange({ marketData }: CurrencyExchangeProps) {
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [enteredAmount, setEnteredAmount] = useState(0);
  const sourceCurrencyData = marketData.find(
    (currency) => currency.symbol === sourceCurrency,
  );

  const targetCurrencyData = marketData.find(
    (currency) => currency.symbol === targetCurrency,
  );
  const sourceCurrencyPrice = sourceCurrencyData?.currentPrice ?? 0;
  const targetCurrencyPrice = targetCurrencyData?.currentPrice ?? 0;
  function processMarketData() {
    const currencyList = marketData.map((currency) => ({
      value: currency.symbol,
      label: `${currency.name} (${currency.symbol.slice(0, 3)})`,
    }));
    return currencyList;
  }
  function handleCurrencyEnter(event: ChangeEvent<HTMLInputElement>) {
    setEnteredAmount(Number(event.target.value));
  }
  function swapCurrencies() {
    const tempCurrency = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(tempCurrency);
  }
  function calculateConversion() {
    if (targetCurrencyPrice === 0 || sourceCurrencyPrice === 0) {
      return 0;
    }
    return (enteredAmount * sourceCurrencyPrice) / targetCurrencyPrice;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="ml-2 text-lg font-semibold">
        Calculate Currency Conversion
      </h2>
      <div className="">
        <CurrencySelector
          selectedItem={sourceCurrency}
          itemsList={processMarketData()}
          placeHolderText="Select source currency"
          onCurrencySelect={setSourceCurrency}
        />
      </div>
      <div className="">
        <label htmlFor="amount" className="ml-2 text-sm font-medium">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          min="0"
          placeholder="Enter amount to convert"
          onChange={handleCurrencyEnter}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "+") {
              e.preventDefault();
            }
          }}
          className="w-full rounded-md border border-indigo-200 shadow-sm  px-3 py-2 text-sm bg-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none "
        />
      </div>
      <div className="">
        <button
          onClick={swapCurrencies}
          className="group relative flex cursor-pointer items-center justify-center rounded-sm p-4 text-indigo-400 hover:text-indigo-500"
        >
          <Icon icon="charm:swap-vertical" className="size-8" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 mr-1 hidden group-hover:block px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
            Swap currencies
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
          </div>
        </button>
      </div>
      <div className="">
        <CurrencySelector
          selectedItem={targetCurrency}
          itemsList={processMarketData()}
          placeHolderText="Select target currency"
          onCurrencySelect={setTargetCurrency}
        />
      </div>
      <div className="">
        <label htmlFor="Converted" className="ml-2 text-sm font-medium">
          Converted amount
        </label>
        <div className="w-full rounded-md border border-indigo-200 bg-gray-50 px-3 py-2 text-sm">
          {sourceCurrency === "" || targetCurrency === ""
            ? "-"
            : calculateConversion()}
        </div>
      </div>
    </div>
  );
}
