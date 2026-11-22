import { z } from "zod";
export declare const emailParamSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const signupSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export declare const profileSchema: z.ZodObject<{
    education: z.ZodOptional<z.ZodUnknown>;
    address: z.ZodOptional<z.ZodUnknown>;
    contact: z.ZodOptional<z.ZodUnknown>;
    linkedIn: z.ZodOptional<z.ZodUnknown>;
    faceBook: z.ZodOptional<z.ZodUnknown>;
    hobby: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export declare const signupQuerySchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export { paginationQuerySchema } from "../../utils/pagination.js";
