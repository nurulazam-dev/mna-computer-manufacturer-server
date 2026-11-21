import { z } from "zod";

export const emailParamSchema = z.object({ email: z.string().email() });

export const idParamSchema = z.object({ id: z.string().min(1) });

export const signupSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (v) =>
      v.email === undefined ||
      (typeof v.email === "string" && z.email().safeParse(v.email).success),
    "A valid email is required",
  );

export const profileSchema = z
  .object({
    education: z.unknown().optional(),
    address: z.unknown().optional(),
    contact: z.unknown().optional(),
    linkedIn: z.unknown().optional(),
    faceBook: z.unknown().optional(),
    hobby: z.unknown().optional(),
  })
  .strict();

export const signupQuerySchema = z.object({ email: z.string().email() });
