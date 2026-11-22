import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";
export declare const reviewService: {
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
    create: (data: AnyDoc) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
};
