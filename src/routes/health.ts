import { Router } from "express";
import { HealthController } from "../controller/health.js";

const router = Router();
const healthController = new HealthController();

router.get("/greet", (req, res, next) => healthController.greet(req, res, next))

export default router;

