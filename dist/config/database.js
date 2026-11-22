import { MongoClient } from "mongodb";
import { env } from "./env.js";
const client = new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10_000,
});
let database = null;
let connecting = null;
export async function connectDatabase() {
    if (database)
        return;
    if (!connecting) {
        connecting = (async () => {
            await client.connect();
            database = client.db(env.DB_NAME);
            await database.command({ ping: 1 });
            console.log(`Database connected`);
        })().catch((error) => {
            connecting = null;
            throw error;
        });
    }
    await connecting;
}
export function getMongoClient() {
    return client;
}
export function getDatabase() {
    if (!database)
        throw new Error("Database is not initialized");
    return database;
}
export async function disconnectDatabase() {
    await client.close();
    database = null;
    connecting = null;
}
export async function createDatabaseIndexes() {
    const db = getDatabase();
    await Promise.all([
        db.collection("users").createIndex({ email: 1 }),
        db.collection("orders").createIndex({ customer: 1 }),
        db.collection("orders").createIndex({ paid: 1 }),
        db.collection("reviews").createIndex({ createdAt: -1 }),
    ]);
}
//# sourceMappingURL=database.js.map