export function LoadingScreen() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-indigo-950">
          Loading market data…
        </p>
        <p className="mt-1 text-sm text-gray-500">Connecting to Binance</p>
      </div>
    </div>
  );
}
