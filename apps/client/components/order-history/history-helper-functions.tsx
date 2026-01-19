"use client";
import React from "react";
import { order, OrderType } from "../../../../packages/db/generated/prisma";
import { CircleX } from "lucide-react";
import { SocketMsgPropType, symbolMap } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export const EmptyState = ({ label }: { label: string }) => (
  <div className="py-12 text-center text-gray-500">No {label} trades</div>
);

export const TypeBadge = ({ type }: { type: OrderType }) => (
  <Badge
    variant="outline"
    className={`bg-transparent ${
      type === "SELL"
        ? "border-red-500 text-red-500"
        : "border-green-500 text-green-500"
    }`}
  >
    ● {type}
  </Badge>
);

export function OrdersTable({
  orders,
  variant,
  onClose,
  latestWsArray,
}: {
  orders: order[];
  variant: "open" | "closed";
  onClose: (orderId: string) => void;
  latestWsArray: SocketMsgPropType[];
}) {
  const getCurrentPrice = (
    order: order,
    latestWsArray: SocketMsgPropType[],
  ): number | null => {
    const fullSymbol = symbolMap[order.asset as keyof typeof symbolMap];
    const wsData = latestWsArray.find((ws) => ws.symbol === fullSymbol);
    console.log("wsdata", wsData);

    if (!wsData || !wsData.price) return null;
    console.log("wsdata", wsData);

    return order.type === "BUY"
      ? Number(wsData.price.ask)
      : Number(wsData.price.bid);
  };
  const getPnL = (
    order: order,
    latestWsArray: SocketMsgPropType[],
  ): number | null => {
    const currentPrice = getCurrentPrice(order, latestWsArray);
    if (currentPrice === null) return null;

    const openPrice = Number(order.openPrice);
    // const qty = Number(order.quantity);

    if (order.type === "BUY") {
      return currentPrice - openPrice;
    }

    // SELL
    return openPrice - currentPrice;
  };

  if (!orders.length) return <EmptyState label={variant} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-muted-foreground text-muted-foreground">
          <tr>
            <th className="py-3 px-2 text-left">Symbol</th>
            <th className="py-3 px-2 text-left">Type</th>
            <th className="py-3 px-2 text-left">Volume</th>
            <th className="py-3 px-2 text-left">Open price</th>
            <th className="py-3 px-2 text-left">
              {variant === "open" ? "Current price" : "Close price"}
            </th>

            {variant === "open" ? (
              <>
                <th className="py-3 px-2 text-left">T/P</th>
                <th className="py-3 px-2 text-left">S/L</th>
                <th className="py-3 px-2 text-left">Position</th>
                <th className="py-3 px-2 text-left">P/L USD</th>
              </>
            ) : (
              <>
                <th className="py-3 px-2 text-left">Open time</th>
                <th className="py-3 px-2 text-left">Close time</th>
                <th className="py-3 px-2 text-left">Profit</th>
                <th className="py-3 px-2 text-left">P/L USD</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-800 ">
              <td className="py-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    🇺🇸
                  </span>
                  {o.asset}
                </div>
              </td>

              <td className="py-4 px-2">
                <TypeBadge type={o.type} />
              </td>

              <td className="py-4 px-2 text-gray-300">
                {" "}
                {Number(o.quantity).toFixed(2)}
              </td>

              <td className="py-4 px-2 text-gray-300">
                {Number(o.openPrice).toFixed(3)}
              </td>

              {variant === "open" ? (
                <>
                  <td className="py-4 px-2 text-gray-300">
                    {(() => {
                      const currentPrice = getCurrentPrice(o, latestWsArray);
                      return currentPrice
                        ? Number(currentPrice).toFixed(3)
                        : "--";
                    })()}
                  </td>
                  <td className="py-4 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto text-blue-400"
                    >
                      Add
                    </Button>
                  </td>
                  <td className="py-4 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto text-blue-400"
                    >
                      Add
                    </Button>
                  </td>
                  <td></td>
                  <td
                    className={`py-4 px-2 ${(() => {
                      const pnl = getPnL(o, latestWsArray);
                      if (pnl === null) return "text-gray-400";
                      return pnl >= 0 ? "text-green-500" : "text-red-500";
                    })()}`}
                  >
                    {(() => {
                      const pnl = getPnL(o, latestWsArray);
                      return pnl !== null ? pnl.toFixed(2) : "--";
                    })()}
                  </td>

                  <td className="py-4 px-2 text-gray-300"> </td>
                  <td
                    className="py-4 px-2 text-2 text-gray-300 hover:text-red-500 hover:scale-105"
                    onClick={() => {
                      onClose(o.id);
                    }}
                  >
                    {" "}
                    <CircleX />
                  </td>
                </>
              ) : (
                <>
                  <td className="py-4 px-2 text-xs text-gray-400">
                    {" "}
                    {Number(o.closePrice).toFixed(4)}
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-400">
                    {/* {Number(o.openPrice).toFixed(4)} */}
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-400">jf</td>

                  <td className="py-4 px-2 text-xs text-gray-400">jf</td>
                  <td className="py-4 px-2 text-xs text-gray-400">
                    {Number(o.pnl)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
