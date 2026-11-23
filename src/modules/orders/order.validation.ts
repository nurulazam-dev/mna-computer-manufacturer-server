import { z } from "zod";

export const idParamSchema = z.object({ id: z.string().min(1) });

export const createOrderSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (v) => typeof v.customer === "string" && v.customer.includes("@"),
    "A valid customer email is required",
  );

export const orderQuerySchema = z.object({ customer: z.string().email() });

export const paymentUpdateSchema = z
  .object({
    transactionId: z.string().min(1),
    paymentIntentId: z.string().optional(),
  })
  .passthrough();

export { paginationQuerySchema } from "../../utils/pagination.js";
