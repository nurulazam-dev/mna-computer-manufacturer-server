import { z } from "zod";

export const paymentIntentSchema = z
  .object({
    shouldPay: z.coerce.number().positive().optional(),
    amount: z.coerce.number().positive().optional(),
    orderId: z.string().optional(),
  })
  .refine(
    (v) => v.shouldPay !== undefined || v.amount !== undefined || !!v.orderId,
    "Payment amount or orderId is required",
  );
