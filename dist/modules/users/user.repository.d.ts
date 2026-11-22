import { type AnyDoc } from "../shared.js";
import { type PaginationQuery } from "../../utils/pagination.js";
export declare const userRepository: {
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
    findByEmail: (email: string) => Promise<import("mongodb").WithId<import("bson").Document> | null>;
    upsertByEmail: (email: string, data: AnyDoc) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    updateProfile: (email: string, data: AnyDoc) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    makeAdmin: (id: string) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
};
