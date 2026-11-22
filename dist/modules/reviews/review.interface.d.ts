import type { Document } from "mongodb";
export type Review = Document & {
    [key: string]: unknown;
};
