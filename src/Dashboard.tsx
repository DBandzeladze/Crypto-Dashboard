import CurrencyList from "./components/CurrencyList";
import { useMarketData } from "./hooks/useMarketData";
import { ConnectionStatusIndicator } from "./components/ConnectionStatus";
import { SearchBar } from "./components/SearchBar";
import { useEffect, useState } from "react";
import type {
  ActiveView,
  MarketCurrency,
  SortDirection,
  SortOption,
} from "./types/market";
import { SortingMenu } from "./components/SortingMenu";
import { MarketViewToggle } from "./components/MarketViewToggle";
import { HiddenCurrenciesToggle } from "./components/HiddenCurrenciesToggle";
import { toast } from "@/components/ui/toast";
import { CurrencyExchange } from "./components/CurrencyExchange";

function Dashboard() {
  const { marketData, connectionStatus, priceAlert } = useMarketData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeView, setActiveView] = useState<ActiveView>("all");
  const [showHidden, setShowHidden] = useState(false);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>(
    () => {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        try {
          return JSON.parse(savedFavorites);
        } catch {
          return {};
        }
      } else {
        return {};
      }
    },
  );
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>(() => {
    const savedHidden = localStorage.getItem("hidden");
    if (savedHidden) {
      try {
        return JSON.parse(savedHidden);
      } catch {
        return {};
      }
    } else {
      return {};
    }
  });
  function selectByActiveView(data: MarketCurrency[], activeView: ActiveView) {
    if (activeView === "all") {
      return data;
    }
    const selectedMarketData = [...data];
    return selectedMarketData.filter(
      (Currency) => favoriteMap[Currency.symbol] === true,
    );
  }
  function separateHiddenMarketData(data: MarketCurrency[]) {
    const visibleMarketData = [...data].filter(
      (Currency) =>
        hiddenMap[Currency.symbol] === undefined ||
        hiddenMap[Currency.symbol] === false,
    );
    const hiddenMarketData = [...data].filter(
      (Currency) => hiddenMap[Currency.symbol] === true,
    );
    return { visibleMarketData, hiddenMarketData };
  }
  function filterMarketData(marketData: MarketCurrency[]) {
    const lowerTerm = searchTerm.toLowerCase();
    const filteredMarketData = marketData.filter(
      (currency) =>
        currency.name.toLowerCase().includes(lowerTerm) ||
        currency.symbol.slice(0, 3).toLowerCase().includes(lowerTerm),
    );
    return filteredMarketData;
  }
  function sortMarketData(
    data: MarketCurrency[],
    sortOption: SortOption,
    sortDirection: SortDirection,
  ) {
    const sortedData = [...data];
    if (sortOption === "name") {
      return sortedData.sort((currency1, currency2) => {
        return sortDirection === "asc"
          ? currency1.name.localeCompare(currency2.name)
          : currency2.name.localeCompare(currency1.name);
      });
    }
    if (sortOption === "currentPrice") {
      return sortedData.sort((currency1, currency2) => {
        return sortDirection === "asc"
          ? currency1.currentPrice - currency2.currentPrice
          : currency2.currentPrice - currency1.currentPrice;
      });
    }
    if (sortOption === "priceChange") {
      return sortedData.sort((currency1, currency2) => {
        return sortDirection === "asc"
          ? currency1.currentPrice -
              currency1.previousPrice -
              (currency2.currentPrice - currency2.previousPrice)
          : currency2.currentPrice -
              currency2.previousPrice -
              (currency1.currentPrice - currency1.previousPrice);
      });
    }
    return sortedData;
  }

  function processMarketData() {
    const { visibleMarketData, hiddenMarketData } =
      separateHiddenMarketData(marketData);
    const selectedMarketData = selectByActiveView(
      visibleMarketData,
      activeView,
    );
    const selectedHiddenData = selectByActiveView(hiddenMarketData, activeView);
    const filteredMarketData = filterMarketData(selectedMarketData);
    const sortedMarketData = sortMarketData(
      filteredMarketData,
      sortOption,
      sortDirection,
    );
    return { sortedMarketData, selectedHiddenData };
  }
  function onSortChange(selection: {
    option: SortOption;
    direction: SortDirection;
  }) {
    setSortOption(selection.option);
    setSortDirection(selection.direction);
  }
  function onFavoriteChange(symbol: string) {
    setFavoriteMap((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  }
  function onHiddenChange(symbol: string) {
    setHiddenMap((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  }
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteMap));
  }, [favoriteMap]);
  useEffect(() => {
    localStorage.setItem("hidden", JSON.stringify(hiddenMap));
  }, [hiddenMap]);

  const { sortedMarketData, selectedHiddenData } = processMarketData();

  useEffect(() => {
    if (priceAlert === undefined) return;

    const isUp = priceAlert.direction === "up";
    const arrow = isUp ? "↑" : "↓";
    const sign = isUp ? "+" : "";
    const pctText = `${sign}${priceAlert.percentageChange.toFixed(2)}%`;
    const pair = `${priceAlert.symbol.slice(0, -4)}/USDT`;

    const id = toast.add({
      title: `${priceAlert.name} significant Price Change Alert`,
      type: "info",
      description: (
        <div>
          <div className="flex flex-row justify-between">
            <span>
              {pair} {arrow}
            </span>
            <span>{pctText}</span>
          </div>

          <div className="flex flex-row justify-between">
            <span>Initial price</span>
            <span>
              $
              {priceAlert.initialPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </div>

          <div className="flex flex-row justify-between">
            <span>Current price</span>
            <span>
              $
              {priceAlert.currentPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </div>
          <div>Since you opened the page</div>
        </div>
      ),
      actionProps: {
        onClick() {
          toast.close(id);
        },
      },
    });
  }, [priceAlert]);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-8xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Crypto Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Live cryptocurrency market data
            </p>
          </div>

          <ConnectionStatusIndicator connectionStatus={connectionStatus} />
        </header>
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MarketViewToggle
              onMarketViewChange={setActiveView}
              activeView={activeView}
            />
            <div className="flex flex-row gap-3">
              <div className="w-full sm:max-w-md">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
              <SortingMenu onSortChange={onSortChange} />
            </div>
          </div>
        </section>
        <section className="mt-6">
          <CurrencyList
            marketData={sortedMarketData}
            onFavoriteChange={onFavoriteChange}
            favoriteMap={favoriteMap}
            onHiddenChange={onHiddenChange}
            hiddenMap={hiddenMap}
          />
        </section>

        <section className="mt-8">
          {selectedHiddenData.length > 0 && (
            <div className="mt-4">
              <HiddenCurrenciesToggle
                isOpen={showHidden}
                onOpenchange={setShowHidden}
                HiddenCount={selectedHiddenData.length}
              />
            </div>
          )}
          {showHidden && (
            <CurrencyList
              marketData={selectedHiddenData}
              onFavoriteChange={onFavoriteChange}
              favoriteMap={favoriteMap}
              onHiddenChange={onHiddenChange}
              hiddenMap={hiddenMap}
            />
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-indigo-950">
              Currency Converter
            </h2>
            <p className="text-sm text-gray-500">
              Convert between supported cryptocurrencies using live prices.
            </p>
          </div>

          <CurrencyExchange marketData={marketData} />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
