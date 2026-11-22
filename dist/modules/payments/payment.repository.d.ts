import type { ClientSession } from "mongodb";
export declare const paymentRepository: {
    findByTransactionId: (transactionId: string, session?: ClientSession) => Promise<import("bson").Document | null>;
    create: (data: Record<string, unknown>, session?: ClientSession) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
};
