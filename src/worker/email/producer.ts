import { MQRepositoryType } from "../../repository/redis/queue.js";
import { EmailJob } from "../../types/job/index.js";

export interface EmailProducerType {
    enqueue: (job: EmailJob) => Promise<void>
}

export class EmailProducer {
    private mqRepository: MQRepositoryType
    private queueName: string
    constructor(mqRepository: MQRepositoryType, queueName: string) {
        this.mqRepository = mqRepository;
        this.queueName = queueName;
    }
    enqueue = async (job: EmailJob): Promise<void> => {
        await this.mqRepository.enqueue(this.queueName, job, 1);
    }
}
