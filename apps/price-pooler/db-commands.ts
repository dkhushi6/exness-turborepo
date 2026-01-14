import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log(" client connected");

  // Create hypertable
  await client.query(`
    CREATE TABLE IF NOT EXISTS metrics.kline(
      "time" timestamptz NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION,
      PRIMARY KEY ("time", symbol)
    ) 
  `);

  console.log(" main table created");
  await client.query(`
  SELECT create_hypertable(
    'metrics.kline',
    'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
  );
`);
  console.log(" hypertable  created");

  const candleData = [
    { name: "kline_1m", chunkTime: "1 minute" },
    { name: "kline_5m", chunkTime: "5 minutes" },
    { name: "kline_10m", chunkTime: "10 minutes" },
    { name: "kline_30m", chunkTime: "30 minutes" },
  ];

  for (const chunk of candleData) {
    // Materialized view
    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS metrics.${chunk.name}
      WITH (timescaledb.continuous) AS
      SELECT
        time_bucket(INTERVAL '${chunk.chunkTime}', time) AS bucket,
        symbol,
        MAX(price) AS high,
        MIN(price) AS low,
        first(price, time) AS open,
        last(price, time) AS close
      FROM metrics.kline
      GROUP BY bucket, symbol
    `);
    console.log(`Materialized view created: ${chunk.name}`);

    // Continuous aggregate policy
    await client.query(`
      SELECT add_continuous_aggregate_policy(
        'metrics.${chunk.name}',
        start_offset => INTERVAL '1 day',
        end_offset => INTERVAL '1 minute',
        schedule_interval => INTERVAL '${chunk.chunkTime}'
      );
    `);
    console.log(` Policy added: ${chunk.name}`);
  }

  await client.end();
  console.log(" client disconnected");
}

main().catch(console.error);
