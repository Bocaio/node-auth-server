import { EmailServiceType } from "../../service/email.js";
import { MQRepositoryType } from "../../repository/redis.js";
import { BaseConsumer } from "../base-consumer.js";
import { EmailJob } from "../../types/job/index.js";

export class EmailConsumer extends BaseConsumer<EmailJob> {
    private emailService: EmailServiceType;

    constructor(mqRepository: MQRepositoryType, queueName: string, emailService: EmailServiceType) {
        super(mqRepository, queueName)
        this.emailService = emailService;
    }

    onMessage = async (data: EmailJob) => {
        await this.emailService.sendWelcome(data.email, data.name)
        console.log("Sent Email")
    }
}