import { getDatabase } from "./database.js";
export function getCollections() {
    const db = getDatabase();
    return {
        products: db.collection("products"),
        orders: db.collection("orders"),
        payments: db.collection("payments"),
        users: db.collection("users"),
        reviews: db.collection("reviews"),
    };
}
//# sourceMappingURL=collections.js.map