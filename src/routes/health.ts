import { Router } from "express";
import { healthController } from "../dependency-injection/controller.js";

const router = Router();

router.get("/greet", (req, res, next) => healthController.greet(req, res, next))

export default router;

