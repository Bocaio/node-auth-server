import { RedisClientType } from "redis";
import redisClient from "../queue/index.js";

export interface MQRepositoryType {
    enqueue: (queueName: string, job: any) => Promise<void>;
    dequeue: (queueName: string) => Promise<any>;
}

export class MQRepository {
    private readonly redis: RedisClientType
    constructor() {
        this.redis = redisClient;
    }

    enqueue = async (queueName: string, job: any) => {
        await this.redis.lPush(queueName, JSON.stringify(job));
        console.log("Job enqueued : ", job)
    }
    dequeue = async (queueName: string) => {
        const result = await this.redis.brPop(queueName, 0);
        return result ? JSON.parse(result.element) : null
    }
}