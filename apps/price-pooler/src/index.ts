import { Queue } from "bullmq";
import { createClient } from "redis";
import WebSocket from "ws";
async function main() {
  const queue = new Queue("pricePooler");
  const pub = createClient();
  await pub.connect();
  console.log("Publisher connected");

  const ws = new WebSocket(
    "wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1s/solusdt@kline_1s/ethusdt@kline_1s"
  );
  console.log("ws send");
  ws.on("message", async (data) => {
    console.log("ws is on");
    console.log("data fron binance is", JSON.parse(data.toString()));
    const dataInfo = JSON.parse(data.toString()); //get data object
    const candleData = {
      symbol: dataInfo.data.s,
      time: dataInfo.data.k.T,
      open: parseFloat(dataInfo.data.k.o),
      high: parseFloat(dataInfo.data.k.h),
      low: parseFloat(dataInfo.data.k.l),
      close: parseFloat(dataInfo.data.k.c),
    };
    const sendData = {
      k: dataInfo.data.k,

      symbol: dataInfo.data.s,
      price: {
        bid: parseFloat((parseFloat(dataInfo.data.k.c) - 10).toFixed(2)),
        ask: parseFloat((parseFloat(dataInfo.data.k.c) + 10).toFixed(2)),
      },
    };
    const queryData = {
      symbol: dataInfo.data.s,
      price: dataInfo.data.k.c,
    };
    await pub.publish("data", JSON.stringify(sendData)); //accepts data in string
    await queue.add("dataDB", queryData, { removeOnComplete: true });
  });
}

main().catch(console.error);
