import { AuthController } from "../controller/auth.js";
import { UserController } from "../controller/user.js";
import { HealthController } from "../controller/health.js";
import { authService, userService, emailService, emailProducer } from "./services.js";

export const authController = new AuthController(authService, emailProducer, emailService);
export const userController = new UserController(userService);
export const healthController = new HealthController();
