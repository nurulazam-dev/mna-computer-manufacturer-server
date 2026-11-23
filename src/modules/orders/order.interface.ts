import type { Document } from "mongodb";

export type Order = Document & {
  customer?: string;
  paid?: boolean;
  price?: number;
  [key: string]: unknown;
};
