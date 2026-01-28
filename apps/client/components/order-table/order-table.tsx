"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useSession } from "next-auth/react";
import { OrderType } from "../../../../packages/db/generated/prisma";
import {
  PriceType,
  SocketMsgPropType,
  symbolIcons,
  symbolMap,
  SymbolType,
} from "../../lib/types";
import { getCurrentAssetPrice } from "../../functions/get-current-asset-price";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { handelBuySellOrder } from "../../functions/fetch-buy-sell-order";
import Image from "next/image";
type OrderTableType = {
  selectedSymbol: SymbolType;
  latestWsArray: SocketMsgPropType[] | [];
};
type FullSymbolType = (typeof symbolMap)[SymbolType];

const OrderTable = ({ selectedSymbol, latestWsArray }: OrderTableType) => {
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [leverage, setLeverage] = useState<number>(1);
  const [margin, setMargin] = useState(0);
  const { data: session } = useSession();
  const [fullSymbol, setFullSymbol] = useState<FullSymbolType>(
    symbolMap[selectedSymbol],
  );
  const [currentAssetPrice, setCurrentAssetPrice] = useState<PriceType | null>(
    null,
  );

  const [lot, setLot] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);

  const leverageOptions = [1, 2, 5, 10, 50, 100, 200];
  if (!session) {
    console.log("no session");
  }
  const userId = session?.user?.id;
  useEffect(() => {
    const calculateMargin = () => {
      if (!orderType || !currentAssetPrice) return "";

      const lotNum = Number(lot);
      const lev = Number(leverage);

      if (!lotNum || !lev) return "";

      const price =
        orderType === "BUY"
          ? Number(currentAssetPrice.ask)
          : Number(currentAssetPrice.bid);

      if (!price) return "";

      const marginRequired = (price * lotNum) / lev;

      setMargin(Number(marginRequired.toFixed(2)));
    };

    calculateMargin();
  }, [currentAssetPrice, orderType, leverage, lot]);
  useEffect(() => {
    setOrderType(null);
    setLot(0);
    setLeverage(1);
    setMargin(0);
    setTakeProfit(0);
    setStopLoss(0);
    setCurrentAssetPrice(null);

    setFullSymbol(symbolMap[selectedSymbol]);
  }, [selectedSymbol]);

  useEffect(() => {
    const sym = symbolMap[selectedSymbol];
    setFullSymbol(sym);
    getCurrentAssetPrice({
      selectedSymbol,
      setCurrentAssetPrice,
      latestWsArray,
    });
  }, [latestWsArray, currentAssetPrice, selectedSymbol]);
  // Compute static bounds based on current WS price

  const getWsPriceBounds = (orderType: OrderType, price: number) => {
    const percent = 0.2; // 20% max range from current price
    if (orderType === "BUY") {
      return {
        tp: {
          min: price * 1.001, // at least 0.1% above
          max: price * (1 + percent),
          default: price * 1.01, // default 1% above
        },
        sl: {
          min: price * (1 - percent),
          max: price * 0.999, // just below current price
          default: price * 0.99, // default 1% below
        },
      };
    }

    return {
      tp: {
        min: price * (1 - percent),
        max: price * 0.999, // just below current price
        default: price * 0.99, // default 1% below
      },
      sl: {
        min: price * 1.001, // just above current price
        max: price * (1 + percent),
        default: price * 1.01, // default 1% above
      },
    };
  };

  return (
    <Card className="p-6 rounded-lg max-w-md  border h-full">
      <div className="flex gap-2  text-lg">
        <Image
          src={symbolIcons[fullSymbol] || ""}
          alt={fullSymbol}
          width={28}
          height={20}
        />
        {selectedSymbol}
      </div>
      <div className="flex gap-3 mb-6">
        <Button
          className={`flex-1 h-[88px] rounded-lg font-semibold text-base transition-all ${
            orderType === "SELL"
              ? "bg-[#ff4757] hover:bg-[#ff4757]/90 text-white border-2 border-[#ff4757]"
              : "bg-transparent hover:bg-[#ff4757]/10 text-[#ff4757] border-2 border-[#ff4757]/30"
          }`}
          onClick={() => setOrderType("SELL")}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-light">Sell</div>
            <div>{currentAssetPrice?.bid}</div>
          </div>
        </Button>
        <Button
          className={`flex-1 h-[88px] rounded-lg font-semibold text-base transition-all ${
            orderType === "BUY"
              ? "bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white border-2 border-[#3b82f6]"
              : "bg-transparent hover:bg-[#3b82f6]/10 text-[#3b82f6] border-2 border-[#3b82f6]/30"
          }`}
          onClick={() => setOrderType("BUY")}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-light">Buy</div>
            <div className="">{currentAssetPrice?.ask}</div>
          </div>
        </Button>
      </div>

      <div className="mb-5">
        <div className="text-[#8b92a7] text-sm font-medium mb-2">Volume</div>
        <div>
          <Input
            type="number"
            step="0.01"
            placeholder="Lots"
            value={lot}
            onChange={(e) => setLot(Number(e.target.value))}
            className="   placeholder:text-[#5a6175] border h-12 rounded-lg focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[#8b92a7] text-sm font-medium mb-3">Leverage</div>
        <div className="grid grid-cols-4 gap-2">
          {leverageOptions.map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
                leverage === lev
                  ? "bg-muted-foreground text-white"
                  : "  hover:bg-[#535764a1]"
              }`}
            >
              1:{lev}
            </button>
          ))}
        </div>
      </div>

      {orderType && currentAssetPrice && (
        <div className="mb-5">
          <div className="text-sm font-medium mb-2">TakeProfit</div>
          <div className="flex justify-between gap-2">
            <Input
              type="number"
              step="0.1"
              value={takeProfit}
              onChange={(e) => {
                const price =
                  orderType === "BUY"
                    ? Number(currentAssetPrice.ask).toFixed(2)
                    : Number(currentAssetPrice.bid).toFixed(2);
                const bounds = getWsPriceBounds(orderType, Number(price));
                let val = Number(e.target.value);
                if (val < bounds.tp.min) val = bounds.tp.min;
                if (val > bounds.tp.max) val = bounds.tp.max;
                val = Number(val.toFixed(2));
                setTakeProfit(val);
              }}
              className="placeholder:text-[#5a6175]"
            />{" "}
            {takeProfit !== 0 && (
              <Button
                variant="outline"
                className="text-gray-500 text-lg hover:text-gray-800"
                onClick={() => {
                  setTakeProfit(0);
                }}
              >
                ×
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Min:{" "}
            {getWsPriceBounds(
              orderType,
              orderType === "BUY"
                ? Number(currentAssetPrice.ask)
                : Number(currentAssetPrice.bid),
            ).tp.min.toFixed(2)}{" "}
            | Max:{" "}
            {getWsPriceBounds(
              orderType,
              orderType === "BUY"
                ? Number(currentAssetPrice.ask)
                : Number(currentAssetPrice.bid),
            ).tp.max.toFixed(2)}
          </div>
        </div>
      )}

      {orderType && currentAssetPrice && (
        <div className="mb-5">
          <div className="text-sm font-medium mb-2">StopLoss</div>
          <div className="flex justify-between gap-2">
            <Input
              type="number"
              step="0.1"
              value={stopLoss}
              onChange={(e) => {
                const price =
                  orderType === "BUY"
                    ? Number(currentAssetPrice.ask).toFixed(2)
                    : Number(currentAssetPrice.bid).toFixed(2);
                const bounds = getWsPriceBounds(orderType, Number(price));
                let val = Number(e.target.value);
                if (val < bounds.sl.min) val = bounds.sl.min;
                if (val > bounds.sl.max) val = bounds.sl.max;
                val = Number(val.toFixed(2));

                setStopLoss(val);
              }}
              className="placeholder:text-[#5a6175]"
            />{" "}
            {stopLoss !== 0 && (
              <Button
                variant="outline"
                className="text-gray-500 text-lg hover:text-gray-800"
                onClick={() => {
                  setStopLoss(0);
                }}
              >
                ×
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Min:{" "}
            {getWsPriceBounds(
              orderType,
              orderType === "BUY"
                ? Number(currentAssetPrice.ask)
                : Number(currentAssetPrice.bid),
            ).sl.min.toFixed(2)}{" "}
            | Max:{" "}
            {getWsPriceBounds(
              orderType,
              orderType === "BUY"
                ? Number(currentAssetPrice.ask)
                : Number(currentAssetPrice.bid),
            ).sl.max.toFixed(2)}
          </div>
        </div>
      )}

      <div className="flex justify-between text-muted-foreground items-center">
        <div>Margin</div>
        <div className="text-sm">${margin}</div>
      </div>
      {orderType && (
        <div className="">
          {orderType === "BUY" ? (
            <Button
              className="flex-1 w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white py-5 rounded-[6px]  text-sm"
              onClick={() =>
                handelBuySellOrder({
                  userId,
                  selectedSymbol,
                  lot,
                  leverage,
                  orderType,
                  setOrderType,
                  takeProfit,
                  stopLoss,
                })
              }
            >
              Confirm Buy {lot} lots
            </Button>
          ) : (
            <Button
              className="flex-1 w-full bg-[#ff4757] hover:bg-[#ff4757]/90 text-white py-5 rounded-[6px]  text-sm"
              onClick={() =>
                handelBuySellOrder({
                  userId,
                  selectedSymbol,
                  lot,
                  leverage,
                  orderType,
                  setOrderType,
                  takeProfit,
                  stopLoss,
                })
              }
            >
              Confirm Sell {lot} lots
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setOrderType(null);
              setLot(0);
            }}
            className="flex-1 w-full mt-2   py-5 rounded-[7px]  text-sm"
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OrderTable;
