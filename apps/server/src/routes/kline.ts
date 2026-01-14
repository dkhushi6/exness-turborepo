import { Router } from "express";
import { redisClient } from "../db.js";

const router = Router();
const intervalMap = {
  "1min": "kline_1m",
  "5min": "kline_5m",
  "10min": "kline_10m",
  "30min": "kline_30m",
};
const symbolMap = {
  btc: "BTCUSDT",
  eth: "ETHUSDT",
  sol: "SOLUSDT",
};

router.post("/kline", async (req, res) => {
  const { symbol, interval } = req.body;
  if (!symbol) {
    return res.json({
      message: "no symbol received",
    });
  }
  if (!interval) {
    return res.json({
      message: "no interval received",
    });
  }
  const table = intervalMap[interval];
  const symbolName = symbolMap[symbol];
  try {
    const result = await redisClient.query(
      `SELECT
  FLOOR(EXTRACT(EPOCH FROM bucket))::BIGINT AS time,
  open,
  high,
  low,
  close,
  symbol FROM metrics.${table} WHERE symbol = $1
 ORDER BY bucket DESC LIMIT 200`,
      [symbolName]
    );
    // console.log(result);
    return res.json({
      message: `${symbolName} and ${table} data recieved`,
      table: result.rows,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Error fetching data" });
  }
});

export default router;
