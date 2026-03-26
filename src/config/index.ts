import dotenv from "dotenv";

dotenv.config();

export const CONFIGS = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    NODE_ENV: process.env.NODE_ENV as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    SMTP_GMAIL: process.env.GMAIL as string,
    SMTP_PASSWORD: process.env.PASSWORD as string
}

