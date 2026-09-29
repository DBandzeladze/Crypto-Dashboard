export function ErrorScreen() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-indigo-950">
          Unable to load market data.
        </p>
        <p className="mt-1 text-sm text-gray-500">Trying to reconnect…</p>
      </div>
    </div>
  );
}
