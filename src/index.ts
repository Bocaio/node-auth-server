import express from "express";
import cors from "cors";
import pool from "./database/index.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js"
import errorMiddleWare from "./middlewares/error.js";
import authMiddleware from "./middlewares/auth.js";
import redisClient from "./queue/index.js";

const app = express();
const port: string = "8080";

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/health", authMiddleware, healthRoutes)
app.use(errorMiddleWare)

async function main() {
  await redisClient.connect();
  console.log("server connection to Redis")

  const server = app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });

  process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");

    try {
      await redisClient.close();
      await pool.end();
      server.close(() => {
        console.log("💤 Server closed.");
        process.exit(0);
      });
    } catch (err) {
      console.error("Shutdown error:", err);
      process.exit(1);
    }
  });
}

main().catch((err) => {
  console.log("Server failed to start", err);
  process.exit(1);
})
