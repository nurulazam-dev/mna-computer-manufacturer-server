import { z } from "zod";
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createOrderSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export declare const orderQuerySchema: z.ZodObject<{
    customer: z.ZodString;
}, z.core.$strip>;
export declare const paymentUpdateSchema: z.ZodObject<{
    transactionId: z.ZodString;
    paymentIntentId: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export { paginationQuerySchema } from "../../utils/pagination.js";
