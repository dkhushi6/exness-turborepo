"use client";
import { CandlestickData } from "lightweight-charts";
import React from "react";
import Candles from "./candels";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  symbolIcons,
  SymbolInfoType,
  symbolMap,
  SymbolType,
} from "../../lib/types";
import Image from "next/image";

type candelChartPropstypes = {
  candleData: CandlestickData[];
  selectedSymbol: SymbolType;
  symbolInfo: SymbolInfoType;
  isLoading?: boolean;
  interval: string;
  setInterval: React.Dispatch<React.SetStateAction<string>>;
};
const CandelChart = ({
  candleData,
  selectedSymbol,
  symbolInfo,
  interval,
  setInterval,
}: candelChartPropstypes) => {
  const currentInfo = symbolInfo[selectedSymbol];
  const fullSymbol = symbolMap[selectedSymbol];
  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
      <Card className="w-full   shadow-2xl ">
        <div className={`px-6 pb-3  border-b  flex justify-between`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1 flex gap-3">
              <Image
                src={symbolIcons[fullSymbol] || ""}
                alt={fullSymbol}
                width={30}
                height={20}
              />
              <h2 className="text-2xl font-bold  flex items-center gap-2">
                {currentInfo.name}
                <span className="text-gray-400 text-lg font-normal">
                  ({currentInfo.symbol})
                </span>
              </h2>
            </div>
          </div>
          <div>
            <Select value={interval} onValueChange={(e) => setInterval(e)}>
              <SelectTrigger className="w-[100px]  ">
                <SelectValue placeholder="1min" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1min">1 min</SelectItem>
                <SelectItem value="5min">5 min</SelectItem>
                <SelectItem value="10min">10 min</SelectItem>
                <SelectItem value="30min">30 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="  relative">
          <Candles candleData={candleData} />
        </div>
      </Card>
    </div>
  );
};

export default CandelChart;
