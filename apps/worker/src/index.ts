import { Worker } from "bullmq";
import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();
async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const worker = new Worker(
    "pricePooler",
    async (job) => {
      console.log("Name:", job.name);
      console.log("Data:", job.data);
      const data = job.data;
      await client.query(
        `
      INSERT INTO metrics.kline ("time" , symbol , price)
      VALUES (NOW(),$1,$2)`,
        [data.symbol, data.price]
      );
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    }
  );
  worker.on("completed", async (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed`, err);
  });
}
main().catch(console.error);
