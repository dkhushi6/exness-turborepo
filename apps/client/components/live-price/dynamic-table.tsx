"use client";
import React from "react";
import { Card } from "../ui/card";
import { PriceType, symbolIcons } from "../../lib/types";
import { cn } from "../../lib/utils";
import Image from "next/image";

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"] as const;

type DynamicTablePropTypes = {
  dynamicWsData: Record<string, PriceType>;
};

const DynamicTable = ({ dynamicWsData }: DynamicTablePropTypes) => {
  return (
    <Card className="w-full h-full border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3  text-[15px] border-b border-border">
        <h3 className=" font-semibold text-foreground text-xl">
          Market Prices
        </h3>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/40 text-foreground">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          Live
        </div>
      </div>

      {/* Table */}
      <div className="text-[15px]">
        {/* Table Head */}
        <div className="grid grid-cols-3 px-4 py-2 border-b border-border text-muted-foreground">
          <div>Symbol</div>
          <div className="text-right">Bid</div>
          <div className="text-right">Ask</div>
        </div>

        {/* Rows */}
        {symbols.map((sym) => {
          const bid = dynamicWsData[sym]?.bid;
          const ask = dynamicWsData[sym]?.ask;

          return (
            <div
              key={sym}
              className="grid grid-cols-3 px-4 py-2 border-b border-border last:border-b-0"
            >
              <div className="uppercase text-foreground flex gap-2">
                <Image
                  src={symbolIcons[sym]}
                  alt={sym}
                  width={22}
                  height={20}
                />
                {sym.replace("USDT", "")}
              </div>

              <div
                className={cn(
                  "text-right",
                  bid ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {bid ?? "-"}
              </div>

              <div
                className={cn(
                  "text-right",
                  ask ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {ask ?? "-"}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DynamicTable;
