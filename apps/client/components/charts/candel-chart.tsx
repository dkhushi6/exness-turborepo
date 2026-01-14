"use client";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";
import React, { useEffect, useState } from "react";
import Candles from "./candels";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type symbolType = "btc" | "eth" | "sol";
type SymbolInfoType = Record<
  symbolType,
  { name: string; symbol: string; color: string }
>;

type candelChartPropstypes = {
  candleData: CandlestickData[];
  selectedSymbol: symbolType;
  symbolInfo: SymbolInfoType;
  isLoading: boolean;
  interval: string;
  setInterval: React.Dispatch<React.SetStateAction<string>>;
};
const CandelChart = ({
  candleData,
  selectedSymbol,
  symbolInfo,
  isLoading,
  interval,
  setInterval,
}: candelChartPropstypes) => {
  const currentInfo = symbolInfo[selectedSymbol];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Main Chart Card */}
      <Card className="w-full bg-black border-gray-800 shadow-2xl ">
        {/* Chart Header */}
        <div
          className={`px-6 pb-3  border-b border-gray-800 flex justify-between`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {currentInfo.name}
                <span className="text-gray-400 text-lg font-normal">
                  ({currentInfo.symbol})
                </span>
              </h2>
            </div>
          </div>
          <div>
            <Select value={interval} onValueChange={(e) => setInterval(e)}>
              <SelectTrigger className="w-[100px] text-white ">
                <SelectValue placeholder="1min" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1min">1min</SelectItem>
                <SelectItem value="5min">5min</SelectItem>
                <SelectItem value="10min">10min</SelectItem>
                <SelectItem value="30min">30min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className=" bg-black relative">
          {/* {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          )} */}
          <Candles candleData={candleData} />
        </div>
      </Card>
    </div>
  );
};

export default CandelChart;
