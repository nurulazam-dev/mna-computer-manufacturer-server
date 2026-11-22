import { ObjectId } from "mongodb";
export type AnyDoc = Record<string, any>;
export declare function objectId(value: string): ObjectId;
export declare function requireEmail(reqEmail?: string): string;
