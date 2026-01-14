import { Router } from "express";
import { getLatestWSMessage } from "../lib/ws-store.js";
import { prisma } from "@repo/db";
import { Decimal } from "@prisma/client/runtime/library";

const router = Router();

const symbolMap = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  sol: "SOLUSDT",
} as const;
router.post("/open", async (req, res) => {
  const wsDataArr = getLatestWSMessage();
  const { userId, asset, quantity, leverage, type, takeProfit, stopLoss } =
    req.body;

  if (!userId) {
    return res.json({ message: "no userid" });
  }
  if (!asset) {
    return res.json({ message: "no asset" });
  }
  if (!quantity) {
    return res.json({ message: "no quantity" });
  }
  if (!leverage) {
    return res.json({ message: "no leverage" });
  }
  if (!type) {
    return res.json({ message: "no type" });
  }

  console.log("ASSET", asset);
  const assetSymbol = symbolMap[asset as keyof typeof symbolMap];
  console.log("assetSymbol is", assetSymbol);
  const wsDataForAsset = wsDataArr?.find((m) => m.symbol === assetSymbol);
  console.log("wsdataass", wsDataForAsset);
  if (!wsDataForAsset?.price) {
    return res

      .status(503)
      .json({ message: "Market data not available for this asset" });
  }

  if (wsDataForAsset.symbol !== assetSymbol) {
    console.log("symbol dont match");
    return res
      .status(400)
      .json({ message: "Market data not available for this asset" });
  }

  const assetPrice =
    type === "BUY"
      ? Number(wsDataForAsset.price.ask)
      : Number(wsDataForAsset.price.bid);
  console.log(wsDataForAsset);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
      userId,
    });
  }
  await prisma.order.create({
    data: {
      userId,
      type,
      asset,
      quantity,
      leverage,
      openPrice: assetPrice,
      takeProfit: takeProfit ? new Decimal(takeProfit) : null,
      stopLoss: stopLoss ? new Decimal(stopLoss) : null,
    },
  });
  const userWithOrders = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userWithOrders) {
    console.log("no orders with user");
    return;
  }
  const positionValue = assetPrice * quantity;
  const margin = new Decimal(positionValue).div(leverage);
  console.log("Margin", margin);
  const usd = userWithOrders.usd;
  console.log("USD", usd);

  // if (usd < margin) {
  //   throw new Error("Insufficient margin");
  // }
  const newUsd = usd.minus(margin);
  console.log("newUsd", newUsd);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { usd: newUsd },
    include: {
      balance: true,
    },
  });
  console.log("updated usd after opening", updatedUser.usd);

  // console.log("asset price", assetPrice);
  return res.json({ message: "purchase successfull", balance: updatedUser });
});

//close order
router.put("/close", async (req, res) => {
  console.log("inside close backend");
  const wsDataArr = getLatestWSMessage();

  const { userId, orderId } = req.body;
  if (!userId) {
    return res.json({ message: "no userId" });
  }
  if (!orderId) {
    return res.json({ message: "no orderId" });
  }
  console.log(orderId);

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }
  const { asset } = order;
  const assetSymbol = symbolMap[asset as keyof typeof symbolMap];
  const wsDataForAsset = wsDataArr?.find((m) => m.symbol === assetSymbol);

  if (!wsDataForAsset?.price) {
    return res
      .status(503)
      .json({ message: "Market data not available for this asset" });
  }

  if (wsDataForAsset.symbol !== assetSymbol) {
    console.log("symbol dont match");
    return res
      .status(400)
      .json({ message: "Market data not available for this asset" });
  }

  const closePrice =
    order.type === "BUY"
      ? Number(wsDataForAsset.price.bid)
      : Number(wsDataForAsset.price.ask);
  const pnl =
    order.type === "BUY"
      ? new Decimal(closePrice).sub(order.openPrice).toNumber()
      : new Decimal(order.openPrice).sub(closePrice).toNumber();

  const closedAt = new Date();
  const updatedOrder = await prisma.order.updateMany({
    where: { id: orderId, userId },
    data: {
      isClosed: true,
      closePrice,
      closedAt,
      pnl,
    },
  });
  const { quantity, leverage } = order;
  const positionValue = closePrice * Number(quantity);
  const margin = new Decimal(positionValue).div(leverage);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { usd: { increment: margin } },
  });
  console.log("updated usd after closing", updatedUser.usd);
  console.log("updated table", updatedOrder);
  return res.json({
    message: "order deleted successfull",
    updatedOrder,
  });
});
export default router;
