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
function connect() {
  console.log("connecting to ws server...");
  ws.on("open", () => {
    console.log(`ws server connected at ${url}`);
  });
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    latestWSMessages.push(msg);

    if (latestWSMessages.length > MAX_HISTORY) {
      latestWSMessages.shift();
    }
  });

  ws.on("close", () => {
    console.log("Disconnected, retrying...");
  });

  ws.on("error", console.error);
}
connect();
// export const setLatestWSMessage = (msg: any) => {
//   latestWSMessage = msg;
//   //   console.log("lastestWSMEssage", latestWSMessage);
// };

export const getLatestWSMessage = () => {
  if (latestWSMessages.length === 0) return null;
  return latestWSMessages;
};
