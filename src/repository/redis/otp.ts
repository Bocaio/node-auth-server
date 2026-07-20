import { RedisClientType } from "redis";
import redisClient from "../../config/redis.js";


export interface IOTPRepository {
    set: (key: string, value: string) => Promise<void>
    get: (key: string) => Promise<string | null>
}

export class OTPRepository implements IOTPRepository {
    private readonly redis: RedisClientType;
    private readonly prefix: string;
    private readonly expired: number;
    constructor() {
        this.redis = redisClient;
        this.prefix = "otp";
        this.expired = 5 * 60;
    }
    set = async (key: string, value: string): Promise<void> => {
        await this.redis.SET(`${this.prefix}:${key}`, value, { expiration: { type: "EX", value: this.expired } });
    }
    get = async (key: string): Promise<string | null> => {
        return await this.redis.GET(`${this.prefix}:${key}`);
    }
}