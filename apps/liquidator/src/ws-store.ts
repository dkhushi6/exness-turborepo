import { WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.WS_URL_PORT;
const ws = new WebSocket(url);
const MAX_HISTORY = 3;
const THROTTLE_MS = 5000;

// real-time rolling buffer
let rollingBuffer: any[] = [];

// stable snapshot for liquidator
export let snapshot: any[] = [];

let lastFlush = Date.now();
ws.on("open", () => {
  console.log("BAckend ws connected");
});
ws.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  rollingBuffer.push(msg);
  if (rollingBuffer.length > MAX_HISTORY) {
    rollingBuffer.shift();
  }

  const now = Date.now();

  if (rollingBuffer.length === MAX_HISTORY && now - lastFlush >= THROTTLE_MS) {
    snapshot = [...rollingBuffer];
    lastFlush = now;
    // console.log("snapshot dynamic", snapshot);
  }
});

ws.on("close", () => {
  console.log("Disconnected, retrying...");
});

ws.on("error", console.error);
