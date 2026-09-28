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

function Dashboard() {
  const { marketData, connectionStatus, priceAlert } = useMarketData();
  console.log(priceAlert);
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
    const filteredMarketData = filterMarketData(selectedMarketData);
    const sortedMarketData = sortMarketData(
      filteredMarketData,
      sortOption,
      sortDirection,
    );
    return { sortedMarketData, hiddenMarketData };
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

  const { sortedMarketData, hiddenMarketData } = processMarketData();

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
      <header className="flex flex-row-reverse">
        <span className="mt-2 mr-6">
          <ConnectionStatusIndicator connectionStatus={connectionStatus} />
        </span>
      </header>
      <div className="ml-4 flex flex-row gap-2">
        <MarketViewToggle
          onMarketViewChange={setActiveView}
          activeView={activeView}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="">
          <SortingMenu onSortChange={onSortChange} />
        </div>
      </div>
      <CurrencyList
        marketData={sortedMarketData}
        onFavoriteChange={onFavoriteChange}
        favoriteMap={favoriteMap}
        onHiddenChange={onHiddenChange}
        hiddenMap={hiddenMap}
      />
      {hiddenMarketData.length ? (
        <div className="ml-4">
          <HiddenCurrenciesToggle
            isOpen={showHidden}
            onOpenchange={setShowHidden}
            HiddenCount={hiddenMarketData.length}
          />
        </div>
      ) : (
        <></>
      )}
      {showHidden ? (
        <CurrencyList
          marketData={hiddenMarketData}
          onFavoriteChange={onFavoriteChange}
          favoriteMap={favoriteMap}
          onHiddenChange={onHiddenChange}
          hiddenMap={hiddenMap}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Dashboard;
