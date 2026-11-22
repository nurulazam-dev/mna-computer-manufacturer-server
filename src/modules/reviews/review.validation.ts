import { z } from "zod";

export const reviewSchema = z
  .record(z.string(), z.unknown())
  .refine((v) => Object.keys(v).length > 0, "Review data is required");

export { paginationQuerySchema } from "../../utils/pagination.js";
