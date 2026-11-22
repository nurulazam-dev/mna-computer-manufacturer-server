import { z } from "zod";

export const productSchema = z
  .record(z.string(), z.unknown())
  .refine((v) => Object.keys(v).length > 0, "Product data is required");

export const idParamSchema = z.object({ id: z.string().min(1) });

export const purchaseParamSchema = z.object({ purchaseId: z.string().min(1) });

export { paginationQuerySchema } from "../../utils/pagination.js";
