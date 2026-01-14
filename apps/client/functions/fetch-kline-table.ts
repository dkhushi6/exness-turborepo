import { SocketMsgPropType } from "../lib/types";
import { getkline } from "./get-kline-graph";
import { CandlestickData } from "lightweight-charts";
const symbolMap = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  sol: "SOLUSDT",
} as const;
type SelectedSymbol = "btc" | "eth" | "sol";

type fetchKlineTablePropsTypes = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  latestWsArray: SocketMsgPropType[];
  selectedSymbol: SelectedSymbol;
  interval: string;
  setData: React.Dispatch<React.SetStateAction<CandlestickData[]>>;
};
export const fetchKlineTable = async ({
  setIsLoading,
  latestWsArray,
  selectedSymbol,
  interval,
  setData,
}: fetchKlineTablePropsTypes) => {
  setIsLoading(true);
  try {
    if (!latestWsArray) {
      console.log("no ws data array");
    }
    const fullSymbol = symbolMap[selectedSymbol];
    const filteredArray = latestWsArray.filter(
      (socketData) => socketData.symbol === fullSymbol
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
  } finally {
    setIsLoading(false);
  }
};
