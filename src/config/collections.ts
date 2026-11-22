import type { Collection, Document } from "mongodb";
import { getDatabase } from "./database.js";

export interface Collections {
  products: Collection<Document>;
  orders: Collection<Document>;
  payments: Collection<Document>;
  users: Collection<Document>;
  reviews: Collection<Document>;
}

export function getCollections(): Collections {
  const db = getDatabase();

  return {
    products: db.collection("products"),
    orders: db.collection("orders"),
    payments: db.collection("payments"),
    users: db.collection("users"),
    reviews: db.collection("reviews"),
  };
}
