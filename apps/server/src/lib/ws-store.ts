import { WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.WS_URL_PORT;
if (!url) {
  throw new Error("WS_URL_PORT is not defined");
}
const MAX_HISTORY = 3;
export let latestWSMessages: any[] = [];
let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

function connect() {
  if (ws) return;

  ws = new WebSocket(url);

  console.log("connecting to ws server...");

  ws.on("open", () => {
    console.log(`ws server connected at ${url}`);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    latestWSMessages.push(msg);

    if (latestWSMessages.length > MAX_HISTORY) {
      latestWSMessages.shift();
    }
  });

  ws.on("close", () => {
    console.log("ws server closed...");
    cleanupAndRetry();
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
    ws?.close();
  });
}
function cleanupAndRetry() {
  ws?.removeAllListeners();
  ws = null;

  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, 500);
}
connect();

export const getLatestWSMessage = () => {
  if (latestWSMessages.length === 0) return null;
  return latestWSMessages;
};
