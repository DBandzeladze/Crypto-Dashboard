import { useState } from "react";
import type { MarketCurrency } from "../types/market";
import { Icon } from "@iconify/react";

type CurrencyCardProps = {
  currency: MarketCurrency;
  isFavorite: boolean;
  onFavoriteChange: (symbol: string) => void;
};

export function CurrencyCard({
  currency,
  isFavorite,
  onFavoriteChange,
}: CurrencyCardProps) {
  const { symbol, name, currentPrice, priceDirection } = currency;
  const isUp = priceDirection === "up";
  const isDown = priceDirection === "down";
  const currencyIcon = `cryptocurrency:${symbol.slice(0, 3).toLowerCase()}`;
  function handleFavoriteChange() {
    onFavoriteChange(symbol);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
            <Icon className="h-6 w-6 text-indigo-900" icon={currencyIcon} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-indigo-950">
              {symbol}
            </span>
            <span className="text-xs text-indigo-400">{name}</span>
          </div>
        </div>

        <span>
          <button
            onClick={handleFavoriteChange}
            className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full text-indigo-400"
          >
            <Icon
              icon={isFavorite ? "carbon:favorite-filled" : "carbon:favorite"}
              className="size-6"
            />
          </button>
        </span>
      </div>

      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col-reverse">
          <p className="text-2xl font-semibold tracking-tight text-indigo-950">
            $
            {currentPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full text-xs ${
            isUp
              ? "bg-emerald-50 text-emerald-600"
              : isDown
                ? "bg-rose-50 text-rose-600"
                : "bg-indigo-50 text-indigo-400"
          }`}
        >
          <Icon
            icon={
              isUp ? "mdi:arrow-up" : isDown ? "mdi:arrow-down" : "mdi:minus"
            }
            className="size-4"
          />
        </span>
      </div>
    </div>
  );
}

export default CurrencyCard;
