import { SocketMsgPropType, symbolMap, SymbolType } from "../lib/types";
import { getkline } from "./get-kline-graph";
import { CandlestickData } from "lightweight-charts";

type fetchKlineTablePropsTypes = {
  latestWsArray: SocketMsgPropType[];
  selectedSymbol: SymbolType;
  interval: string;
  setData: React.Dispatch<React.SetStateAction<CandlestickData[]>>;
};
export const fetchKlineTable = async ({
  latestWsArray,
  selectedSymbol,
  interval,
  setData,
}: fetchKlineTablePropsTypes) => {
  try {
    if (!latestWsArray) {
      console.log("no ws data array");
    }
    const fullSymbol = symbolMap[selectedSymbol];
    const filteredArray = latestWsArray.filter(
      (socketData) => socketData.symbol === fullSymbol,
    );
    const latestSocketData =
      filteredArray.length > 0
        ? filteredArray[filteredArray.length - 1]
        : undefined;
    const table = await getkline({
      socketData: latestSocketData,
      symbol: selectedSymbol,
      interval: interval,
    });
    if (table) {
      console.log("raw time:", table[0].time);

      setData(table);
    }
  } catch (err) {
    console.error("error fetching kline", err);
  }
};
