import { Router } from "express";
import { userController } from "../dependency-injection/controller.js";

const router = Router();

router.get("/", (req, res, next) => userController.getUser(req, res, next));

export default router;
