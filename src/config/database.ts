import { MongoClient, type Db } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI, {
  maxPoolSize: 20,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10_000,
});

let database: Db | null = null;
let connecting: Promise<void> | null = null;

export async function connectDatabase(): Promise<void> {
  if (database) return;

  if (!connecting) {
    connecting = (async () => {
      await client.connect();
      database = client.db(env.DB_NAME);

      await database.command({ ping: 1 });
      console.log(`MongoDB connected: ${env.DB_NAME}`);
    })().catch((error: unknown) => {
      connecting = null;

      throw error;
    });
  }
  await connecting;
}

export function getMongoClient(): MongoClient {
  return client;
}

export function getDatabase(): Db {
  if (!database) throw new Error("Database is not initialized");

  return database;
}

export async function disconnectDatabase(): Promise<void> {
  await client.close();

  database = null;
  connecting = null;
}

export async function createDatabaseIndexes(): Promise<void> {
  const db = getDatabase();

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }),
    db.collection("orders").createIndex({ customer: 1 }),
    db.collection("orders").createIndex({ paid: 1 }),
    db.collection("reviews").createIndex({ createdAt: -1 }),
  ]);
}
