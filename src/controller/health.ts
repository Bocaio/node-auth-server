import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/JwtPayload.js";
import { successHandler } from "../utils/helper.js";


export class HealthController {
    greet = async (req: Request, res: Response, next: NextFunction) => {
        const { userId, email } = req.user as UserPayload;
        successHandler(res, { userId, email }, "health")
    }
}