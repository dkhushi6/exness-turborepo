"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { order } from "../../../../packages/db/generated/prisma";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { OrdersTable } from "./history-helper-functions";
import { SocketMsgPropType } from "@/lib/types";
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
        }
      );
      console.log("updatedOrder", res.data);
      console.log("orderid is ", orderId);
      toast.success(res.data.message);
      console.log(res.data.message);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      toast.error("Error closing order");
    }
  };
  useEffect(() => {}, [latestWsArray]);
  return (
    <div className="bg-black rounded-lg p-4 text-white">
      <Tabs defaultValue="open">
        <TabsList className="grid grid-cols-2 bg-[#252b3b]">
          <TabsTrigger value="open">
            Open
            <Badge className="ml-2 bg-muted-foreground">
              {ordersOpen.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
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
