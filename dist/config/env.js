import "dotenv/config";
import { z } from "zod";
const schema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    DB_NAME: z.string().min(1).default("computer_manufacturer"),
    ACCESS_TOKEN_SECRET: z
        .string()
        .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default("1h"),
    STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
    CLIENT_URL: z.string().url().optional(),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = parsed.data;
//# sourceMappingURL=env.js.map