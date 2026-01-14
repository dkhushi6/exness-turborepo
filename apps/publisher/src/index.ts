import { createClient } from "redis";
import express from "express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.WS_PORT;
const httpServer = app.listen(port);
const wss = new WebSocketServer({ server: httpServer });
wss.on("connection", (socket) => {
  console.log("New WebSocket connection established");
});
async function Subscriber() {
  const sub = createClient();
  await sub.connect();
  console.log("sub connected");
  await sub.subscribe("data", (message) => {
    const data = JSON.parse(message);
    // console.log("data recieved ", data);
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    }
    // console.log("data send");
  });
  console.log(`server running at port:${port}`);
}
Subscriber().catch(console.error);
