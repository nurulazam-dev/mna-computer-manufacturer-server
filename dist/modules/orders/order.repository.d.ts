import { ObjectId, type ClientSession } from "mongodb";
import { type AnyDoc } from "../shared.js";
import { type PaginationQuery } from "../../utils/pagination.js";
export declare const orderRepository: {
    findAll: (query: PaginationQuery) => Promise<{
        data: import("mongodb").WithId<import("bson").Document>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findById: (id: string) => Promise<import("mongodb").WithId<import("bson").Document> | null>;
    findByCustomer: (email: string, query: PaginationQuery) => Promise<{
        data: import("mongodb").WithId<import("bson").Document>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    create: (data: AnyDoc) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    updateById: (id: string, update: AnyDoc) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    markPaid: (id: ObjectId, transactionId: string, session: ClientSession) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    deleteById: (id: string) => Promise<import("mongodb").DeleteResult>;
};
