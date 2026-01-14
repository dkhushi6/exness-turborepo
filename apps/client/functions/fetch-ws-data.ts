import { PriceType, SocketMsgPropType } from "../lib/types";
const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"] as const;

type fetchWsDataProps = {
  setDynamicWsData: React.Dispatch<
    React.SetStateAction<Record<string, PriceType>>
  >;
  setLatestWsArray: React.Dispatch<
    React.SetStateAction<SocketMsgPropType[] | []>
  >;
};
const url = process.env.NEXT_PUBLIC_WS_URL_PORT;

console.log("NEXT_PUBLIC_WS_URL_PORT", url);
export const fetchWsData = ({
  setDynamicWsData,
  setLatestWsArray,
}: fetchWsDataProps) => {
  if (!url) {
    console.log("no url");
    return;
  }
  const socket = new WebSocket(url);
  const throttleMs = 200;
  let lastFlush = Date.now();

  socket.onopen = () => console.log("server connected");
  const MAX_HISTORY = 3;
  let latestWSMessages: any[] = [];
  socket.onmessage = (msg) => {
    const data: SocketMsgPropType = JSON.parse(msg.data);

    latestWSMessages.push(data);
    if (latestWSMessages.length > MAX_HISTORY) {
      latestWSMessages.shift();
    }
    // console.log("LASTEST MESSAGE ARRAY", latestWSMessages);
    const now = Date.now();

    if (
      now - lastFlush >= throttleMs &&
      latestWSMessages.length === MAX_HISTORY
    ) {
      // console.log("Batch for last 200ms:", latestWSMessages);
      setLatestWsArray(latestWSMessages);

      latestWSMessages = [];

      lastFlush = now;
    }
    if (symbols.includes(data.symbol as (typeof symbols)[number])) {
      // console.log("symbol prizzz", data.symbol);
      setDynamicWsData((prev) => ({
        ...prev,
        [data.symbol]: data.price,
      }));
    }
  };

  socket.onerror = (err) => console.log("socket error", err);

  return () => socket.close();
};
