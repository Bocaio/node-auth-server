import { EmailProducer } from "../worker/email/producer.js";
import { emailService } from "../dependency-injection/email.js";
import { EmailConsumer } from "../worker/email/consumer.js";
import { MQRepository } from "../repository/redis/mq.js";

const queueName = "emails";
const mqRepository = new MQRepository();
export const emailConsumer = new EmailConsumer(mqRepository, queueName, emailService);
export const emailProducer = new EmailProducer(mqRepository, queueName);