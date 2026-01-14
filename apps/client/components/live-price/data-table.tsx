"use client";
import React, { useEffect, useState } from "react";
type SocketMsgPropType = {
  symbol: string;
  price: {
    bid: string;
    ask: string;
  };
};
type priceSchemaType = {
  bid: number;
  ask: number;
};
const DataTable = () => {
  const [socketMsg, setSocketMsg] = useState<SocketMsgPropType>();
  const [btc, setbtc] = useState<priceSchemaType | undefined>(undefined);
  const [eth, setEtc] = useState<priceSchemaType | undefined>(undefined);
  const [sol, setSol] = useState<priceSchemaType | undefined>(undefined);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socket.onopen = () => {
      console.log("server connected");
    };
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log("socket message recieved", data);
      setSocketMsg(data);
      if (data.symbol === "BTCUSDT") {
        setbtc(data.price);
      } else if (data.symbol === "ETHUSDT") {
        setEtc(data.price);
      } else if (data.symbol === "SOLUSDT") {
        setSol(data.price);
      }
    };
    socket.onerror = (err) => {
      console.log("socket error", err);
    };
  }, []);
  return (
    <div className="w-full flex justify-center mt-10 text-white">
      <table className="w-[60%]  border-none text-xl">
        <thead className="">
          <tr>
            <th className="border border-b-muted-foreground ">Symbol</th>
            <th className="border border-b-muted-foreground">Bid</th>
            <th className="border border-b-muted-foreground">Ask</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            <td className=" p-3">BTCUSDT</td>
            <td className="border border-gray-600 p-3">{btc?.bid}</td>
            <td className="border border-gray-600 p-3">{btc?.ask}</td>
          </tr>

          <tr className="text-center">
            <td className="border border-gray-600 p-3">ETHUSDT</td>
            <td className="border border-gray-600 p-3">{eth?.bid}</td>
            <td className="border border-gray-600 p-3">{eth?.ask}</td>
          </tr>

          <tr className="text-center">
            <td className="border border-gray-600 p-3">SOLUSDT</td>
            <td className="border border-gray-600 p-3">{sol?.bid}</td>
            <td className="border border-gray-600 p-3">{sol?.ask}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
