import type { Request } from "express";
import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";
export declare const userService: {
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
    getByEmail: (email: string) => Promise<import("mongodb").WithId<import("bson").Document>>;
    isAdmin: (email: string) => Promise<{
        admin: boolean;
    }>;
    signup: (email: string, data: AnyDoc) => Promise<{
        result: import("mongodb").UpdateResult<import("bson").Document>;
        token: string;
    }>;
    updateProfile: (req: Request, email: string, data: AnyDoc) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    promote: (id: string) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
};
