## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### Setup

Clone the repository:

```bash
git clone https://github.com/DBandzeladze/Crypto-Dashboard.git
```

Navigate to the project directory:

```bash
cd Crypto-Dashboard
```

Install the project dependencies:

```bash
npm install
```

## Running the Project

### Development

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in a browser to use the application.

### Production Build

To create a production build:

```bash
npm run build
```

The build command also runs the TypeScript compiler before creating the production bundle.

To preview the production build locally:

```bash
npm run preview
```

## Libraries and Technologies Used

- **React** — Component-based UI development
- **TypeScript** — Static typing and type-safe application logic
- **Vite** — Development server and production build tooling
- **Tailwind CSS** — Utility-based styling and responsive layouts
- **shadcn/ui** — Reusable UI components such as the combobox, dropdown menu, and toast
- **Iconify React** — Cryptocurrency icons
- **Lucide React** — UI icons
- **ESLint** — Code quality and linting
- **Binance WebSocket API** — Real-time cryptocurrency market data

## Project Architecture

The application follows a component-based React architecture with the `Dashboard` component acting as the main orchestration layer. The application has reusable UI components, a custom hook for market data and a shared types file for TypeScript.

```text
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ConnectionStatus.tsx
│   ├── CurrencyCard.tsx
│   ├── CurrencyExchange.tsx
│   ├── CurrencyList.tsx
│   ├── CurrencySelector.tsx
│   ├── DisconnectedScreen.tsx
│   ├── ErrorScreen.tsx
│   ├── HiddenCurrenciesToggle.tsx
│   ├── LoadingScreen.tsx
│   ├── MarketViewToggle.tsx
│   ├── SearchBar.tsx
│   └── SortingMenu.tsx
├── hooks/
│   ├── useMarketData.ts
├── lib/
├── types/
│   └── market.ts
├── App.tsx
├── Dashboard.tsx
├── index.css
└── main.tsx
```

### Dashboard

`Dashboard.tsx` is the main orchestration layer of the application. It receives the live market data from the `useMarketData` hook and manages the UI state for searching, sorting, favorites, hidden currencies, and the active market view.

The dashboard passes the required data and callbacks to the child components through props. Components are focused on their own UI. The dashboard is the only layer that uses `useMarketData` hook to create WebSocket connections and receives market data. This avoids creating multiple connections and duplicating market data logic.

### Market Data

The `useMarketData` hook is responsible for connecting to the Binance WebSocket, processing incoming messages, updating the market data, tracking the connection state, handling reconnection, and generating significant price alerts.

The hook returns processed market data, connection state and the price alert information to the dashboard. This data is then passed to the components that require them through the dashboard.

### Shared Types

The application's TypeScript types are kept in `types/market.ts`. This file contains the types used for Binance WebSocket messages, market currencies, price direction, connection states, sorting, active views, price alerts, and supported currency symbols.

### Components

The components in `components/` are responsible for individual parts of the application, such as displaying currencies, searching and sorting, managing favorites and hidden currencies, showing connection states, and converting between currencies.

The `components/ui/` directory contains reusable shadcn/ui components used by the application.

## Important Technical Decisions and Assumptions

### Binance WebSocket

The application uses Binance's combined ticker WebSocket stream to receive live prices for the supported cryptocurrency pairs. The current implementation supports BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT, and XRP/USDT.

### WebSocket Reconnection

Unexpected WebSocket disconnections trigger an automatic reconnection attempt after 5 seconds. The connection is properly cleaned up when the component unmounts so that a closed component cannot create new connections.

### Initial Loading and Connection States

The application does not display the main dashboard until market data is received. During the initial connection, a loading screen is displayed.

If the WebSocket connection is unexpectedly lost while market data is already available, the application enters the reconnecting state but keeps the previously received market data visible while trying to reconnect.

If a connection error occurs before any market data is received, an error screen is displayed.

### Price Direction

Price direction is determined by comparing the current price that the WebSocket provides with the previously received price for the same cryptocurrency. The displayed direction shows the movement between consecutive updates rather than the 24-hour price change that is provided by the WebSocket.

### Significant Price Alerts

The first price received for each cryptocurrency after the application loads is stored. An alert is triggered when the price changes by at least 2% from that baseline.

When a price alert is triggered, the application remembers which threshold was surpassed, upper or lower. An alert for that currency is not triggered again while the price remains beyond the same threshold. The alert state is reset when the price returns within 2% or passes the opposite threshold. This allows a New alert to be triggered.

### Sorting

The currencies can be sorted in 3 different ways: alphabetically based on the name, based on the current price, and based on price change. Price change is calculated on every update by comparing the current price with the previous price. The difference in price is used for sorting rather than the percentage change.

### Favorites and Hidden Currencies

Favorites and hidden-currency preferences are stored in `localStorage` so that they persist between page reloads.

Favorites and hidden currencies are maintained separately. When the Favorites view is selected, only favorite currencies are displayed. When the Favorites view is active, the hidden currencies section only shows currencies that are both hidden and favorited.

### Calculator

The calculator uses the latest WebSocket prices to convert between the supported cryptocurrencies. Since all the currency pairs are priced in USDT, the conversion uses their USDT prices.

### Supported Currencies

The supported currency pairs are currently defined statically in the application. Adding additional currencies would require updating the supported symbols and their metadata.

### Error Handling

The application handles WebSocket connection errors, unexpected disconnections and empty search results. Messages that cannot be parsed correctly or do not contain the expected information are ignored.
