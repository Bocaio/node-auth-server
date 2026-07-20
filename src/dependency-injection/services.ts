import { CONFIGS } from "../config/index.js";
import { AuthService } from "../service/auth/index.js";
import { UserService } from "../service/user/index.js";
import { EmailService } from "../service/email/index.js";
import { EmailProducer } from "../worker/email/producer.js";
import {
    userRepository,
    refreshTokenRepository,
    otpRepository,
    mqRepository,
} from "./repositories.js";

export const authService = new AuthService(userRepository, refreshTokenRepository, otpRepository);
export const userService = new UserService(userRepository);
export const emailService = new EmailService();
export const emailProducer = new EmailProducer(mqRepository, CONFIGS.EMAIL_QUEUE);
