import { UserRepository } from "../repository/mysql/user.js";
import { RefreshTokenRepository } from "../repository/redis/refresh-token.js";
import { OTPRepository } from "../repository/redis/otp.js";
import { MQRepository } from "../repository/redis/queue.js";

export const userRepository = new UserRepository();
export const refreshTokenRepository = new RefreshTokenRepository();
export const otpRepository = new OTPRepository();
export const mqRepository = new MQRepository();
