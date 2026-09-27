import CurrencyList from "./components/CurrencyList";
import { useMarketData } from "./hooks/useMarketData";
import { ConnectionStatusIndicator } from "./components/ConnectionStatus";
import { SearchBar } from "./components/SearchBar";
import { useEffect, useState } from "react";
import type { MarketCurrency, SortDirection, SortOption } from "./types/market";
import { SortingMenu } from "./components/SortingMenu";

function Dashboard() {
  const { marketData, connectionStatus } = useMarketData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("priceChange");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
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
  function filterMarketData() {
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
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteMap));
  }, [favoriteMap]);
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex flex-row-reverse">
        <span className="mt-2 mr-6">
          <ConnectionStatusIndicator connectionStatus={connectionStatus} />
        </span>
      </header>
      <div className="ml-4 flex flex-row">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="ml-2">
          <SortingMenu onSortChange={onSortChange} />
        </div>
      </div>
      <CurrencyList
        marketData={sortMarketData(
          filterMarketData(),
          sortOption,
          sortDirection,
        )}
        onFavoriteChange={onFavoriteChange}
        favoriteMap={favoriteMap}
      />
    </div>
  );
}

export default Dashboard;
