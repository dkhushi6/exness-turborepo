"use client";
import React from "react";
import { order, OrderType } from "../../../../packages/db/generated/prisma";
import { CircleX } from "lucide-react";
import { SocketMsgPropType, symbolIcons, symbolMap } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";

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

    if (order.type === "BUY") {
      return currentPrice - openPrice;
    }

    return openPrice - currentPrice;
  };
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <th className="py-3 px-2 text-left">P/L USD</th>
              </>
            ) : (
              <>
                <th className="py-3 px-2 text-left">Open time</th>
                <th className="py-3 px-2 text-left">Close time</th>
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
                  <Image
                    src={
                      symbolIcons[
                        symbolMap[
                          o.asset as keyof typeof symbolMap
                        ] as keyof typeof symbolIcons
                      ] || ""
                    }
                    alt={o.asset}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
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
                    {o.takeProfit ? Number(o.takeProfit) : "--"}
                  </td>
                  <td className="py-4 px-2">
                    {o.stopLoss ? Number(o.stopLoss) : "--"}
                  </td>
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
                    {formatDate(o.createdAt.toString())}
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-400">
                    {" "}
                    {formatDate(o.closedAt?.toString())}
                  </td>

                  <td
                    className={`py-4 px-2 ${
                      Number(o.pnl) >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${Number(o.pnl).toFixed(2)}
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
