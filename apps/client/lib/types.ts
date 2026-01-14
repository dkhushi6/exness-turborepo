export const symbolMap = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  sol: "SOLUSDT",
} as const;
export type SymbolType = "btc" | "eth" | "sol";
export type SocketMsgPropType = {
  k: { t: number; o: string; h: string; l: string; c: string };
  symbol: string;
  price: PriceType;
};
export type PriceType = {
  bid: string;
  ask: string;
};
