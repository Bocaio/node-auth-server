import { EmailConsumer } from "../worker/email/consumer.js";
import { MQRepository } from "../repository/redis/queue.js";
import { EmailService } from "../service/email/index.js";
import { CONFIGS } from "../config/index.js";
import { OTPRepository } from "../repository/redis/otp.js";

const queueName = CONFIGS.EMAIL_QUEUE;
const mqRepository = new MQRepository();
export const emailService = new EmailService();
export const emailConsumer = new EmailConsumer(mqRepository, queueName, emailService);