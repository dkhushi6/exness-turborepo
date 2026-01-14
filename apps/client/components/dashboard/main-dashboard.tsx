import React, { useEffect, useState } from "react";
import CandelChart from "../charts/candel-chart";
import OrderTable from "../order-table/order-table";
import { CandlestickData } from "lightweight-charts";
import Navbar from "../navbar/navbar";
import OrderHistory from "../order-history/order-history";
import { order } from "../../../../packages/db/generated/prisma";
import { useSession } from "next-auth/react";
import DynamicTable from "../live-price/dynamic-table";
import { PriceType, SocketMsgPropType, SymbolType } from "../../lib/types";
import { fetchWsData } from "../../functions/fetch-ws-data";
import { fetchKlineTable } from "../../functions/fetch-kline-table";
import { fetchOrdersView } from "../../functions/fetch-orders-view";

const MainDashboard = () => {
  const [candleData, setData] = useState<CandlestickData[]>([]);
  const [orders, setOrders] = useState<order[]>([]);
  const [lockedAmt, setLockedAmt] = useState(0);
  const [tradableAmt, setTradableAmt] = useState(0);

  const [selectedSymbol, setSelectedSymbol] = useState<SymbolType>("btc");
  const [dynamicWsData, setDynamicWsData] = useState<Record<string, PriceType>>(
    {}
  );
  const [balance, setBalance] = useState("5000");

  const { data: session } = useSession();
  const [currentAssetWsData, setCurrentAssetWsData] =
    useState<SocketMsgPropType | null>(null);
  const [latestWsArray, setLatestWsArray] = useState<SocketMsgPropType[] | []>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [interval, setInterval] = useState("1min");

  const symbolInfo = {
    btc: { name: "Bitcoin", symbol: "BTCUSDT", color: "#B3995E" },
    eth: { name: "Ethereum", symbol: "ETHUSDT", color: "#82C995" },
    sol: { name: "Solana", symbol: "SOLUSDT", color: "#F28B82" },
  };

  useEffect(() => {
    fetchWsData({ setDynamicWsData, setLatestWsArray });
  }, []);
  useEffect(() => {
    //fetch latestwsdata for selected symbol
    fetchKlineTable({
      setIsLoading,
      latestWsArray,
      selectedSymbol,
      interval,
      setData,
    });
  }, [selectedSymbol, interval, latestWsArray]);
  useEffect(() => {
    if (!session?.user?.id) {
      console.log("USER NOOOO");
      return;
    }
    const userId = session.user.id;
    fetchOrdersView({
      setOrders,
      setBalance,
      userId,
      latestWsArray,
      setTradableAmt,
      setLockedAmt,
    });
  }, [session, orders]);
  return (
    <div className="bg-black h-screen  w-full">
      <Navbar
        symbolInfo={symbolInfo}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        balance={balance}
        tradableAmt={tradableAmt}
        lockedAmt={lockedAmt}
      />
      <div className="flex ">
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
              isLoading={isLoading}
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
    </div>
  );
};

export default MainDashboard;
