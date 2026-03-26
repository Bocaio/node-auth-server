import { Router } from "express";
import { UserController } from "../controller/auth.js";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import { userService } from "../dependency-injection/auth.js";
import { emailProducer } from "../worker-dependency-injection/email.js";

const router = Router();
const controller = new UserController(userService, emailProducer);

router.post(`/create`, (req, res, next) => controller.create(req, res, next));

router.post(`/login`, (req, res, next) => controller.login(req, res, next));

router.post(`/google`, verifyCSRFToken, (req, res, next) => controller.google(req, res, next))

export default router;
