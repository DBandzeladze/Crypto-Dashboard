import CurrencyList from "./components/CurrencyList";
import { useMarketData } from "./hooks/useMarketData";
import { ConnectionStatusIndicator } from "./components/ConnectionStatus";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";

function Dashboard() {
  const { marketData, connectionStatus } = useMarketData();
  const [searchTerm, setSearchTerm] = useState("");
  function filterMarketData() {
    const lowerTerm = searchTerm.toLowerCase();
    const filteredMarketData = marketData.filter(
      (currency) =>
        currency.name.toLowerCase().includes(lowerTerm) ||
        currency.symbol.slice(0, 3).toLowerCase().includes(lowerTerm),
    );
    return filteredMarketData;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex flex-row-reverse">
        <span className="mt-2 mr-6">
          <ConnectionStatusIndicator connectionStatus={connectionStatus} />
        </span>
      </header>
      <div className="ml-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>
      <CurrencyList marketData={filterMarketData()} />
    </div>
  );
}

export default Dashboard;
