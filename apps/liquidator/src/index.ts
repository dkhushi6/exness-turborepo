//get into db
import { snapshot } from "./ws-store.js";
import "./liquidating-orders.js";
import { liquidator } from "./liquidating-orders.js";

// import { getLatestWSMessage } from "./ws-store";
setInterval(() => {
  if (snapshot.length === 0) return;
  const wsDataArray = snapshot;
  liquidator(wsDataArray);
}, 5000);

async function main() {}
main().catch(console.error);
