"use client";
import React from "react";
import { Card } from "../ui/card";
import { PriceType } from "../../lib/types";

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"] as const;

type DynamicTablePropTypes = {
  dynamicWsData: Record<string, PriceType>;
};
const DynamicTable = ({ dynamicWsData }: DynamicTablePropTypes) => {
  return (
    <Card className="w-full   space-y-2 border-gray-800 h-full">
      <div className="border-b flex justify-between font-semibold px-2 pb-1">
        <div>Symbol</div>
        <div>Bid</div>
        <div>Ask</div>
      </div>
      {symbols.map((sym) => (
        <div
          key={sym}
          className="flex justify-between border-b border-b-muted-foreground py-1 px-2"
        >
          <div>{sym.replace("USDT", "").toLowerCase()}</div>
          <div className="text-green-400">{dynamicWsData[sym]?.bid || "-"}</div>
          <div className="text-red-400">{dynamicWsData[sym]?.ask || "-"}</div>
        </div>
      ))}
    </Card>
  );
};

export default DynamicTable;
