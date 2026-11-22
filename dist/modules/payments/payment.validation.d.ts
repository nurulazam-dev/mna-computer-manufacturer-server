import { z } from "zod";
export declare const paymentIntentSchema: z.ZodObject<{
    shouldPay: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    amount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    orderId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
