import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import klineRoute from "./routes/kline.js";
import ordersRoutes from "./routes/orders.js";
import allOrdersRoutes from "./routes/history.js";

import { createServer } from "node:http";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URL,
    credentials: true,
  }),
);
const server = createServer(app);
app.use("/market", klineRoute);
app.use("/orders", ordersRoutes);
app.use("/orders", allOrdersRoutes);
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});
dotenv.config();
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
