import { z } from "zod";
export declare const productSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const purchaseParamSchema: z.ZodObject<{
    purchaseId: z.ZodString;
}, z.core.$strip>;
export { paginationQuerySchema } from "../../utils/pagination.js";
