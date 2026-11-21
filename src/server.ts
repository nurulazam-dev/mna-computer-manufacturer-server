import { app } from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  createDatabaseIndexes,
  disconnectDatabase,
} from "./config/database.js";

async function startServer(): Promise<void> {
  await connectDatabase();
  await createDatabaseIndexes();

  const server = app.listen(env.PORT, () =>
    console.log(`MNA Computer Manufacturer API running on port ${env.PORT}`),
  );

  let shuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;

    shuttingDown = true;
    console.log(`${signal} received. Closing server...`);

    server.close(async (error) => {
      if (error) console.error("HTTP server close error:", error);
      try {
        await disconnectDatabase();
        process.exit(error ? 1 : 0);
      } catch (closeError) {
        console.error("Database shutdown error:", closeError);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
