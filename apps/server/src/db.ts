import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

redisClient
  .connect()
  .then(() => console.log("📌 PostgreSQL connected"))
  .catch((err) => console.error("❌ DB connection error", err));
