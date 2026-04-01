import { MQRepositoryType } from "../../repository/redis/mq.js";
import { EmailJob } from "../../types/job/index.js";

export interface EmailProducerType {
    enqueueJob: (job: EmailJob) => Promise<void>
}

export class EmailProducer {
    private mqRepository: MQRepositoryType
    private queueName: string
    constructor(mqRepository: MQRepositoryType, queueName: string) {
        this.mqRepository = mqRepository;
        this.queueName = queueName;
    }
    enqueueJob = async (job: EmailJob): Promise<void> => {
        await this.mqRepository.enqueue(this.queueName, job);
        console.log("Job enqueued : ", job)
    }
}
