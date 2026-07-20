import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import database from "./config/database.js";
import redisClient from "./config/redis.js";
import { CONFIGS } from "./config/index.js";

import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/user.js";

import authMiddleware from "./middlewares/auth.js";
import errorMiddleware from "./middlewares/error.js";

const app = express();
const port = Number(CONFIGS.PORT);

app.use(
    cors({
        origin: CONFIGS.CORS_ORIGIN,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/health", authMiddleware, healthRoutes);
app.use("/user", authMiddleware, userRoutes);

app.use(errorMiddleware);

async function main() {
    await redisClient.connect();
    console.log("Connected to Redis");

    const server = app.listen(port);

    server.on("listening", () => {
        console.log(`App listening on port ${port}`);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${port} is already in use — another server is running.`);
        } else {
            console.error("Server error:", err);
        }
        process.exit(1);
    });

    const shutdown = async () => {
        console.log("Shutting down gracefully...");
        try {
            await database.destroy();
            if (redisClient.isOpen) {
                await redisClient.close();
            }
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        } catch (err) {
            console.error("Shutdown error:", err);
            process.exit(1);
        }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

main().catch((err) => {
    console.log("Server failed to start", err);
    process.exit(1);
});
