import { MongoClient, type Db } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI);

let database: Db | null = null;

export async function connectDatabase(): Promise<void> {
  await client.connect();
  database = client.db(env.DB_NAME);
  await database.command({ ping: 1 });
  console.log(`MongoDB connected: ${env.DB_NAME}`);
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error("Database is not initialized.");
  }
  return database;
}

export async function disconnectDatabase(): Promise<void> {
  await client.close();
  database = null;
}
