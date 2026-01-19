import axios from "axios";
import Decimal from "decimal.js";
import { SocketMsgPropType, symbolMap } from "../lib/types";

export const fetchOrdersView = async ({
  setOrders,
  setBalance,
  userId,
  latestWsArray,
  setTradableAmt,
  setLockedAmt,
}: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST_URL}/orders/view`,
      {
        userId,
      },
    );

    const { usd, balance } = res.data.balance;
    let totalLockedMargin = 0;

    if (latestWsArray && latestWsArray.length === 3) {
      for (const order of balance) {
        if (order.isClosed) continue;
        const symbol = symbolMap[order.asset as keyof typeof symbolMap];
        const filteredArray = latestWsArray.filter(
          (socketData: SocketMsgPropType) => socketData.symbol === symbol,
        );
        // if (socketData.symbol !== symbol) continue;
        if (!filteredArray) {
          console.log("symbol in the db dont match the latestWsArray symbol");
        }
        const dynamicPrice =
          order.type === "SELL"
            ? filteredArray[0].price.bid
            : filteredArray[0].price.ask;

        const usedMargin = (dynamicPrice * order.quantity) / order.leverage;
        totalLockedMargin += usedMargin;
      }
    } else {
      totalLockedMargin = 0;
      // console.log("error");
    }

    const TotalAmt = new Decimal(usd).plus(new Decimal(totalLockedMargin));
    const usdDecimal = new Decimal(usd);
    const totalLockedDecimal = new Decimal(totalLockedMargin);
    setLockedAmt(totalLockedDecimal.toFixed(3));
    setTradableAmt(usdDecimal.toFixed(3));
    // console.log("LOCKED BACLANCE", totalLockedMargin);
    setBalance(TotalAmt.toFixed(3));
    setOrders(balance);
  } catch (err) {
    console.error("error fetching order history", err);
  }
  return;
};
