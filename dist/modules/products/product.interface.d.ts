import type { Document } from "mongodb";
export type Product = Document & {
    name?: string;
    price?: number;
    [key: string]: unknown;
};
