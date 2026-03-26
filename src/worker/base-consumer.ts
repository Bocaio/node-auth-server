import { MQRepositoryType, } from "../repository/redis.js";

export abstract class BaseConsumer<T> {
    protected running: boolean;
    private mqRepository: MQRepositoryType;
    private queueName: string;
    constructor(mqRepository: MQRepositoryType, queueName: string) {
        this.mqRepository = mqRepository;
        this.queueName = queueName;
        this.running = false;
    }
    abstract onMessage(data: T): Promise<void>;

    start = async () => {
        this.running = true;
        console.log("Worker started")
        while (this.running) {
            try {
                const data = await this.mqRepository.dequeue(this.queueName);
                if (data) {
                    await this.onMessage(data);
                }
            } catch (err) {
                console.log(`Consumer Error [${this.queueName}]:`, err)
            }
        }
    }

    stop = () => {
        this.running = false;
    }

}