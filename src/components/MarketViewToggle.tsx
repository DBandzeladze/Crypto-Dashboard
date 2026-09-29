import type { ActiveView } from "../types/market";

type MarketViewProps = {
  onMarketViewChange: React.Dispatch<React.SetStateAction<ActiveView>>;
  activeView: ActiveView;
};

export function MarketViewToggle({
  onMarketViewChange,
  activeView,
}: MarketViewProps) {
  function handleViewChange(viewOption: ActiveView) {
    onMarketViewChange(viewOption);
  }

  return (
    <div className="flex flex-row gap-3 max-w-[150px] rounded-md border border-indigo-100 bg-white p-1">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleViewChange("all")}
          className={`cursor-pointer flex items-center justify-center px-2 py-1 rounded-sm  ${activeView === "all" ? "bg-indigo-400 text-white hover:bg-indigo-500" : "text-indigo-400 hover:text-indigo-500"}`}
        >
          All
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleViewChange("favorites")}
          className={`cursor-pointer flex items-center justify-center px-2 py-1  rounded-sm ${activeView === "favorites" ? "bg-indigo-400 text-white hover:bg-indigo-500" : "text-indigo-400 hover:text-indigo-500"}`}
        >
          Favorites
        </button>
      </div>
    </div>
  );
}
