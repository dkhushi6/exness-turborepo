import { toast } from "sonner";
import axios from "axios";
import { SymbolType } from "../lib/types";
import { OrderType } from "@repo/db";

type handelBuySellOrderProps = {
  userId: string | undefined;
  selectedSymbol: SymbolType;
  lot: number | undefined;
  leverage: number | undefined;
  orderType: OrderType | undefined;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType | null>>;
  takeProfit?: number | undefined;
  stopLoss?: number | undefined;
};
export const handelBuySellOrder = async ({
  userId,
  selectedSymbol,
  lot,
  leverage,
  orderType,
  setOrderType,
  takeProfit,
  stopLoss,
}: handelBuySellOrderProps) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST_URL}/orders/open`,
      {
        userId,
        asset: selectedSymbol,
        quantity: lot,
        leverage,
        type: orderType,
        takeProfit,
        stopLoss,
      }
    );
    console.log(res.data.message);

    console.log("balance is", res.data.balance);
    const purList = res.data.balance.balance;
    const lastPur = purList[purList.length - 1];
    console.log("LAST PURCHAE from the user", lastPur);

    toast.success(
      `${lastPur.type} ${lastPur.quantity} lots ${lastPur.asset} at ${lastPur.openPrice} `
    );

    setOrderType(null);
  } catch {
    toast.error("failed to buy/sell");
  }
};
