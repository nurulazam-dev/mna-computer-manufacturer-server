import type { Document } from "mongodb";

export type User = Document & {
  email: string;
  role?: "admin" | "user" | string;
  [key: string]: unknown;
};
