"use client";
import React, { useEffect } from "react";
import { order } from "../../../../packages/db/generated/prisma";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { OrdersTable } from "./history-helper-functions";
import { SocketMsgPropType } from "../../lib/types";
import { Tabs, TabsList } from "@radix-ui/react-tabs";
import { TabsContent, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
type OrderHistoryType = {
  orders: order[];
  setOrders: React.Dispatch<React.SetStateAction<order[]>>;
  latestWsArray: SocketMsgPropType[];
};
export default function OrderHistory({
  orders,
  setOrders,
  latestWsArray,
}: OrderHistoryType) {
  const { data: session } = useSession();
  const ordersOpen = orders.filter((o) => !o.isClosed);
  const ordersClosed = orders.filter((o) => o.isClosed);
  const closeOrder = async (orderId: string) => {
    if (!session) {
      console.log("  no session in closeorder");
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_HOST_URL}/orders/close`,
        {
          userId: session?.user?.id,
          orderId,
        },
      );
      // console.log("updatedOrder", res.data);
      // console.log("orderid is ", orderId);
      toast.success(res.data.message);
      console.log(res.data.message);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      toast.error("Error closing order");
    }
  };
  useEffect(() => {}, [latestWsArray]);
  return (
    <div className=" rounded-lg p-4 text-white">
      <Tabs defaultValue="open">
        <TabsList className="grid grid-cols-2 rounded-lg p-1 bg-gray-200 dark:bg-[#191919]">
          <TabsTrigger
            value="open"
            className="
        data-[state=active]:bg-white
        data-[state=active]:dark:bg-[#2e2d2d]
        data-[state=active]:text-foreground
        data-[state=inactive]:text-gray-600
        data-[state=inactive]:dark:text-gray-400
        rounded-md transition-all
        py-2 px-4
      "
          >
            Open
            <Badge className="ml-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
              {ordersOpen.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="closed"
            className="
        data-[state=active]:bg-white
        data-[state=active]:dark:bg-[#2e2d2d]
        data-[state=active]:text-foreground
        data-[state=inactive]:text-gray-600
        data-[state=inactive]:dark:text-gray-400
        rounded-md transition-all
        py-2 px-4
      "
          >
            Closed
            <Badge className="ml-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
              {ordersClosed.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <OrdersTable
            orders={ordersOpen}
            variant="open"
            onClose={closeOrder}
            latestWsArray={latestWsArray}
          />
        </TabsContent>

        <TabsContent value="closed">
          <OrdersTable
            orders={ordersClosed}
            variant="closed"
            onClose={() => {}}
            latestWsArray={latestWsArray}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
