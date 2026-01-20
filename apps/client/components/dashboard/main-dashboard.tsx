"use client";
import React, { useEffect, useState } from "react";
import CandelChart from "../charts/candel-chart";
import OrderTable from "../order-table/order-table";
import { CandlestickData } from "lightweight-charts";
import Navbar from "../../lib/navbar/navbar";
import OrderHistory from "../order-history/order-history";
import { order } from "../../../../packages/db/generated/prisma";
import { useSession } from "next-auth/react";
import DynamicTable from "../live-price/dynamic-table";
import { PriceType, SocketMsgPropType, SymbolType } from "../../lib/types";
import { fetchWsData } from "../../functions/fetch-ws-data";
import { fetchKlineTable } from "../../functions/fetch-kline-table";
import { fetchOrdersView } from "../../functions/fetch-orders-view";
import MainComponents from "./main-components";
import LandingPage from "../landing/landing-page";

const MainDashboard = () => {
  const [candleData, setData] = useState<CandlestickData[]>([]);
  const [orders, setOrders] = useState<order[]>([]);
  const [lockedAmt, setLockedAmt] = useState(0);
  const [tradableAmt, setTradableAmt] = useState(0);

  const [selectedSymbol, setSelectedSymbol] = useState<SymbolType>("btc");
  const [dynamicWsData, setDynamicWsData] = useState<Record<string, PriceType>>(
    {},
  );
  const [balance, setBalance] = useState("5000");

  const { data: session } = useSession();
  // const [currentAssetWsData, setCurrentAssetWsData] =
  //   useState<SocketMsgPropType | null>(null);
  const [latestWsArray, setLatestWsArray] = useState<SocketMsgPropType[] | []>(
    [],
  );

  const [interval, setInterval] = useState("1min");

  const symbolInfo = {
    btc: { name: "Bitcoin", symbol: "BTCUSDT", color: "#B3995E" },
    eth: { name: "Ethereum", symbol: "ETHUSDT", color: "#82C995" },
    sol: { name: "Solana", symbol: "SOLUSDT", color: "#F28B82" },
  };

  useEffect(() => {
    const cleanup = fetchWsData({ setDynamicWsData, setLatestWsArray });

    return () => {
      cleanup?.();
    };
  }, []);
  useEffect(() => {
    //fetch latestwsdata for selected symbol
    fetchKlineTable({
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
  }, [session?.user?.id, latestWsArray]);

  return (
    <div className=" h-screen  w-full">
      <Navbar
        symbolInfo={symbolInfo}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        balance={balance}
        tradableAmt={tradableAmt}
        lockedAmt={lockedAmt}
      />
      {session?.user?.id ? (
        <MainComponents
          dynamicWsData={dynamicWsData}
          candleData={candleData}
          selectedSymbol={selectedSymbol}
          symbolInfo={symbolInfo}
          interval={interval}
          orders={orders}
          setOrders={setOrders}
          latestWsArray={latestWsArray}
          setInterval={setInterval}
        />
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

export default MainDashboard;
