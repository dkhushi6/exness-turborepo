import { WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.WS_URL_PORT;
if (!url) {
  throw new Error("WS_URL_PORT is not defined");
}
const ws = new WebSocket(url);
const MAX_HISTORY = 3;
export let latestWSMessages: any[] = [];

ws.on("open", () => {
  console.log("BAckend ws connected");
});
ws.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  latestWSMessages.push(msg);

  // keep only last MAX_HISTORY
  if (latestWSMessages.length > MAX_HISTORY) {
    latestWSMessages.shift();
  }
});

ws.on("close", () => {
  console.log("Disconnected, retrying...");
});

ws.on("error", console.error);

// export const setLatestWSMessage = (msg: any) => {
//   latestWSMessage = msg;
//   //   console.log("lastestWSMEssage", latestWSMessage);
// };

export const getLatestWSMessage = () => {
  if (latestWSMessages.length === 0) return null;
  return latestWSMessages;
};
