import axios from "axios";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";
import {
  getLatestPrice,
  SocketDataPropType,
} from "../functions/get-latestest-price";
import { SocketMsgPropType, SymbolType } from "../lib/types";

type getklinePropsTypes = {
  socketData?: SocketMsgPropType;
  symbol: SymbolType;
  interval: string;
};

export const getkline = async ({
  socketData,
  symbol,
  interval,
}: getklinePropsTypes) => {
  if (!symbol) {
    console.log("no symbol");
    return [];
  }
  if (!interval) {
    console.log("no interval");
    return [];
  }
  // fetch historical candles from backend
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_HOST_URL}/market/kline
`,
    {
      symbol,
      interval,
    }
  );

  const unformattedtable: {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
  }[] = res.data.table;

  const table: CandlestickData[] = unformattedtable
    .map((item) => ({
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      time: Number(item.time) as UTCTimestamp,
    }))
    .sort((a, b) => a.time - b.time);
  if (socketData) {
    const latestChunk = getLatestPrice({ socketData, symbol });
    // console.log("socket data pushed");

    if (latestChunk) {
      table.push(latestChunk);
    }
  }

  return table;
};
