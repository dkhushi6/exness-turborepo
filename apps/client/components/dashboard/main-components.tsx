import React from "react";
import DynamicTable from "../live-price/dynamic-table";
import CandelChart from "../charts/candel-chart";
import OrderHistory from "../order-history/order-history";
import OrderTable from "../order-table/order-table";
import {
  PriceType,
  SocketMsgPropType,
  SymbolInfoType,
  SymbolType,
} from "../../lib/types";
import { CandlestickData } from "lightweight-charts";
import { order } from "@/packages/db/dist";
type MainComponentsPropsType = {
  dynamicWsData: Record<string, PriceType>;
  candleData: CandlestickData[];
  selectedSymbol: SymbolType;
  symbolInfo: SymbolInfoType;
  interval: string;
  orders: order[];
  setOrders: React.Dispatch<React.SetStateAction<order[]>>;
  latestWsArray: SocketMsgPropType[];
  setInterval: React.Dispatch<React.SetStateAction<string>>;
};
const MainComponents = ({
  dynamicWsData,
  candleData,
  selectedSymbol,
  symbolInfo,
  interval,
  orders,
  setOrders,
  latestWsArray,
  setInterval,
}: MainComponentsPropsType) => {
  return (
    <div className="flex  ">
      {" "}
      <div className="w-1/4">
        <DynamicTable dynamicWsData={dynamicWsData} />
      </div>
      <div className=" w-2/4">
        <div>
          <CandelChart
            candleData={candleData}
            selectedSymbol={selectedSymbol}
            symbolInfo={symbolInfo}
            interval={interval}
            setInterval={setInterval}
          />
        </div>
        <div>
          <OrderHistory
            orders={orders}
            setOrders={setOrders}
            latestWsArray={latestWsArray}
          />
        </div>
      </div>
      <div className="w-1/4">
        <OrderTable
          selectedSymbol={selectedSymbol}
          latestWsArray={latestWsArray}
        />
      </div>
    </div>
  );
};

export default MainComponents;
