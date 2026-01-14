import { PriceType, SocketMsgPropType, SymbolType } from "../types";
import { UTCTimestamp } from "lightweight-charts";
import { symbolMap } from "../types";

export type SocketDataPropType = {
  k: { t: number; o: string; h: string; l: string; c: string };
  s: string;
  price: PriceType;
};

type GetLatestPriceProp = {
  socketData?: SocketMsgPropType;
  symbol: SymbolType;
};

export const getLatestPrice = ({ socketData, symbol }: GetLatestPriceProp) => {
  if (!socketData) {
    console.log("no socketdata");
    return undefined;
  }

  const fullSymbol = symbolMap[symbol];
  //   console.log("fullsymbol", socketData.symbol);
  if (socketData.symbol !== fullSymbol) return undefined;
  const latestChunk = {
    open: Number(socketData.k.o),
    high: Number(socketData.k.h),
    low: Number(socketData.k.l),
    close: Number(socketData.k.c),
    time: socketData.k.t as UTCTimestamp,
  };
  //   console.log("latestChunk in function ", latestChunk);
  return latestChunk;
};

//balance == total-margin + 1btc(ws price)
