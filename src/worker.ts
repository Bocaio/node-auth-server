import redisClient from "./config/redis.js";
import { emailConsumer } from "./worker-dependency-injection/email.js";

async function main() {
    await redisClient.connect();
    console.log("Worker connected to Redis");
    await emailConsumer.start();
}

async function cleanUp() {
    emailConsumer.stop();
    if (redisClient.isOpen) {
        await redisClient.close();
    }
    process.exit();
}

process.on("SIGINT", async () => {
    console.log("Worker stopping...");
    await cleanUp();
});

process.on("SIGTERM", async () => {
    console.log("Worker stopping...");
    await cleanUp();
});

main().catch(async (err) => {
    console.log("Worker exit:", err);
    await cleanUp();
});
