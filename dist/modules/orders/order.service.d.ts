import type { Request } from "express";
import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";
export declare const orderService: {
    listMine: (email: string, query: PaginationQuery) => Promise<{
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
    listAll: (query: PaginationQuery) => Promise<{
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
    getOne: (req: Request, id: string) => Promise<import("mongodb").WithId<import("bson").Document>>;
    create: (email: string, data: AnyDoc) => Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    cancel: (req: Request, id: string) => Promise<import("mongodb").DeleteResult>;
    markShipment: (id: string) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    completePayment: (req: Request, id: string, payment: AnyDoc) => Promise<import("mongodb").UpdateResult<import("bson").Document>>;
};
