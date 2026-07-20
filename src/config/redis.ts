import { createClient, RedisClientType } from "redis";
import { CONFIGS } from "./index.js";

const redisClient: RedisClientType = createClient({ url: CONFIGS.REDIS_URL });

redisClient.on("error", (err) => {
    console.error("Redis client error:", err);
});

export default redisClient;
