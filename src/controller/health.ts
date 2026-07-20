import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/JwtPayload.js";
import { sendSuccess } from "../utils/helper.js";
import { SuccessMessage } from "../constants/message.js";


export class HealthController {
    greet = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as UserPayload;
        sendSuccess(res, user, 200, { message: SuccessMessage.HEALTH_OK })
    }
}