import dotenv from "dotenv";

dotenv.config();

const required = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

export const CONFIGS = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ?? "8080",
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",

    JWT_SECRET_KEY: required("JWT_SECRET_KEY"),
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "15m",
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? "7d",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",

    DB_HOST: process.env.DB_HOST ?? "localhost",
    DB_PORT: Number(process.env.DB_PORT ?? 3306),
    DB_USER: process.env.DB_USER ?? "root",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    DB_NAME: process.env.DB_NAME ?? "auth_boilerplate",

    REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",

    SMTP_SERVICE: process.env.SMTP_SERVICE ?? "gmail",
    SMTP_USER: process.env.SMTP_USER ?? "",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? "",

    APP_NAME: process.env.APP_NAME ?? "Auth Boilerplate",

    EMAIL_QUEUE: process.env.EMAIL_QUEUE ?? "app:emails",
};
