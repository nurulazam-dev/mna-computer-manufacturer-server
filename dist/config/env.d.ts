import "dotenv/config";
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    MONGODB_URI: string;
    DB_NAME: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    STRIPE_SECRET_KEY: string;
    CLIENT_URL?: string | undefined;
};
