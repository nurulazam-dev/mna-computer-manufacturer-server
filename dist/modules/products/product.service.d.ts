import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";
export declare const productService: {
    list: (query: PaginationQuery) => Promise<{
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
    getPurchase: (id: string) => Promise<import("mongodb").WithId<import("bson").Document>>;
    create: (data: AnyDoc) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    remove: (id: string) => Promise<import("mongodb").DeleteResult>;
};
