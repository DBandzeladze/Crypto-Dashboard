import CurrencyList from "./components/CurrencyList";
import { useMarketData } from "./hooks/useMarketData";
import { ConnectionStatusIndicator } from "./components/ConnectionStatus";

function Dashboard() {
  const { marketData, connectionStatus } = useMarketData();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex flex-row-reverse">
        <span className="mt-2 mr-6">
          <ConnectionStatusIndicator connectionStatus={connectionStatus} />
        </span>
      </header>
      <CurrencyList marketData={marketData} />
    </div>
  );
}

export default Dashboard;
