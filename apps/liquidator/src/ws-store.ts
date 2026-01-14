import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.WS_URL_PORT;
if (!url) throw new Error("WS_URL_PORT not found");

const MAX_HISTORY = 3;
const THROTTLE_MS = 5000;

let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

// real-time rolling buffer
let rollingBuffer: any[] = [];

// stable snapshot for liquidator
export let snapshot: any[] = [];

let lastFlush = Date.now();

function connect() {
  if (ws) return;

  console.log(" connecting to WS...");

  ws = new WebSocket(url);

  ws.on("open", () => {
    console.log(`ws server connected at ${url}`);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    rollingBuffer.push(msg);
    if (rollingBuffer.length > MAX_HISTORY) {
      rollingBuffer.shift();
    }

    const now = Date.now();
    if (
      rollingBuffer.length === MAX_HISTORY &&
      now - lastFlush >= THROTTLE_MS
    ) {
      snapshot = [...rollingBuffer];
      lastFlush = now;
    }
  });

  ws.on("close", () => {
    console.log(" WS closed");
    cleanupAndRetry();
  });

  ws.on("error", (err) => {
    console.error("WS error:", err.message);
    ws?.close(); // force close → triggers retry
  });
}

function cleanupAndRetry() {
  ws?.removeAllListeners();
  ws = null;

  if (reconnectTimer) return;
  //send req after 2sec
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, 2000);
}

connect();
