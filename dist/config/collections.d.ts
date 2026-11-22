import type { Collection, Document } from "mongodb";
export interface Collections {
    products: Collection<Document>;
    orders: Collection<Document>;
    payments: Collection<Document>;
    users: Collection<Document>;
    reviews: Collection<Document>;
}
export declare function getCollections(): Collections;
