import { RedisClientType } from "redis";
import redisClient from "../../config/redis.js";

export interface MQRepositoryType {
    enqueue: (queueName: string, job: any, expired: number) => Promise<void>;
    dequeue: (queueName: string) => Promise<any>;
}

export class MQRepository {
    private readonly redis: RedisClientType
    constructor() {
        this.redis = redisClient;
    }

    enqueue = async (queueName: string, job: any, expired: number) => {
        await this.redis.lPush(queueName, JSON.stringify(job));
        await this.redis.expire(queueName, 60)
        console.log("Job enqueued : ", queueName, job)
    }
    dequeue = async (queueName: string) => {
        const result = await this.redis.brPop(queueName, 0);
        console.log("Job dequeued : ", result)
        return result ? JSON.parse(result.element) : null
    }
}