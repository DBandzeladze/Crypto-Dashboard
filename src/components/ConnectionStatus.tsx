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
      borderColor: "border-yellow-200",
      text: "text-yellow-700",
      background: "bg-green-50",
    },
    connected: {
      label: "Connected",
      color: "bg-green-500",
      borderColor: "border-green-200",
      text: "text-green-700",
      background: "bg-green-50",
    },
    reconnecting: {
      label: "Reconnecting…",
      color: "bg-yellow-500",
      borderColor: "border-yellow-200",
      text: "text-yellow-700",
      background: "bg-yellow-50",
    },
    disconnected: {
      label: "Disconnected",
      color: "bg-red-500",
      borderColor: "border-red-200",
      text: "text-red-700",
      background: "bg-red-50",
    },
    error: {
      label: "Connection error",
      color: "bg-red-500",
      borderColor: "border-red-200",
      text: "text-red-700",
      background: "bg-red-50",
    },
  }[connectionStatus];

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm ${config.text} ${config.background} border ${config.borderColor}`}
    >
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
