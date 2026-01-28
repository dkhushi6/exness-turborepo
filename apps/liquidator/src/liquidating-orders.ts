import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@repo/db";
const symbolMap = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  sol: "SOLUSDT",
} as const;
type WSMessage = {
  symbol: string;
  price: { bid: number; ask: number };
};
export async function liquidator(wsData: WSMessage[]) {
  const allOpenOrders = await prisma.order.findMany({
    where: {
      isClosed: false,
    },
  });
  console.log("all orders are", allOpenOrders);

  //

  for (const order of allOpenOrders) {
    const {
      asset,
      type,
      takeProfit,
      stopLoss,
      id,
      quantity,
      leverage,
      openPrice,
      userId,
    } = order;
    const assetSymbol = symbolMap[asset as keyof typeof symbolMap];
    let closePrice = null;
    let reason: string | null = null;

    const filterData = wsData.find((m) => m.symbol === assetSymbol);
    if (!filterData) {
      console.log("no filterData of symbol found");
      continue;
    }
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      console.log(`No user found for order `);
      continue;
    }
    const userBalance = user.usd;
    const currentPrice = new Decimal(
      type === "BUY" ? filterData.price.bid : filterData.price.ask,
    ).toDecimalPlaces(3, Decimal.ROUND_HALF_UP);

    const pnl =
      type === "BUY"
        ? closePrice.sub(openPrice).mul(quantity).toNumber()
        : openPrice.sub(closePrice).mul(quantity).toNumber();

    const tradeAmount = Number(order.quantity) * Number(order.openPrice);

    // Take Profit
    if (
      takeProfit &&
      ((type === "BUY" && currentPrice.gte(new Decimal(takeProfit))) ||
        (type === "SELL" && currentPrice.lte(new Decimal(takeProfit))))
    ) {
      closePrice = currentPrice;
      reason = "Take Profit";
    }
    //stoploss
    if (
      stopLoss &&
      ((type === "BUY" && currentPrice.lte(new Decimal(stopLoss))) ||
        (type === "SELL" && currentPrice.gte(new Decimal(stopLoss))))
    ) {
      closePrice = currentPrice;
      reason = "Stop Loss";
    }
    // Hard liquidation to prevent negative balance

    if (Math.abs(pnl) > tradeAmount) {
      closePrice = currentPrice;
      reason = "invalid pnl";
    }
    if (closePrice !== null) {
      const closedAt = new Date();
      //updating order
      try {
        await prisma.order.updateMany({
          where: { id, isClosed: false },
          data: { isClosed: true, closePrice, closedAt, pnl },
        });
        console.log(`Order ${id} closed at ${closePrice}`);
      } catch (err) {
        console.error("error closing order", id, err);
      }
      //updating balance
      try {
        const positionValue = closePrice * Number(quantity);
        const margin = new Decimal(positionValue).div(leverage);
        const newUsd = userBalance.plus(margin);

        await prisma.user.update({
          where: { id: userId },
          data: { usd: newUsd },
        });
      } catch {
        console.error("error updating user order");
      }
    } else {
      console.log("order not closed");
    }
  }
}
