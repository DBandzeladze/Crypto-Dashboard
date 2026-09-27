import type { ConnectionStatus } from "../types/market";

type ConnectionStatusIndicatorProps = {
  connectionStatus: ConnectionStatus;
};

export function ConnectionStatusIndicator({
  connectionStatus,
}: ConnectionStatusIndicatorProps) {
  const config = {
    connecting: {
      label: "Connecting…",
      color: "bg-yellow-500",
      text: "text-yellow-700",
    },
    connected: {
      label: "Connected",
      color: "bg-green-500",
      text: "text-green-700",
    },
    reconnecting: {
      label: "Reconnecting…",
      color: "bg-yellow-500",
      text: "text-yellow-700",
    },
    disconnected: {
      label: "Disconnected",
      color: "bg-red-500",
      text: "text-red-700",
    },
    error: {
      label: "Connection error",
      color: "bg-red-500",
      text: "text-red-700",
    },
  }[connectionStatus];

  console.log(connectionStatus);

  return (
    <div className={`flex items-center gap-2 text-sm ${config.text}`}>
      <span
        className={`h-2 w-2 rounded-full ${config.color} ${
          connectionStatus === "reconnecting" ||
          connectionStatus === "connecting"
            ? "animate-pulse"
            : ""
        }`}
      />
      <span>{config.label}</span>
    </div>
  );
}
