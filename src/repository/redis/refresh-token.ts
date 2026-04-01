import { RedisClientType } from "redis";
import redisClient from "../../database/redis.js";

export interface RefreshTokenRepositoryType {
    set: (queueName: string, token: string) => Promise<void>;
    isMember: (queueName: string, token: string) => Promise<boolean>;
}

export class RefreshTokenRepository {
    private readonly redis: RedisClientType;
    private readonly prefix: string;
    private readonly expired: number;
    constructor() {
        this.redis = redisClient;
        this.prefix = "refresh_tokens";
        this.expired = 7 * 24 * 60 * 60;
    }
    set = async (queueName: string, token: string) => {
        await this.redis.sAdd(`${this.prefix}:${queueName}`, token);
        await this.redis.expire(`${this.prefix}:${queueName}`, this.expired);
    }
    isMember = async (queueName: string, token: string) => {
        const member = await this.redis.sIsMember(`${this.prefix}:${queueName}`, token);
        return Boolean(member);
    }
}