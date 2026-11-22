import { type AnyDoc } from "../shared.js";
import { type PaginationQuery } from "../../utils/pagination.js";
export declare const productRepository: {
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
    create: (data: AnyDoc) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    deleteById: (id: string) => Promise<import("mongodb").DeleteResult>;
};
