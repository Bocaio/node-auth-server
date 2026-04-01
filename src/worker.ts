
import redisClient from "./database/redis.js";
import { emailConsumer } from "./worker-dependency-injection/email.js";

async function main() {
    await redisClient.connect();
    await emailConsumer.start();
}

main().catch((err) => {
    console.log("worker stopped : ", err)
})