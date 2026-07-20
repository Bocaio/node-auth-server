import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

import { AppError } from "../types/AppError.js";
import { UserPayload } from "../types/JwtPayload.js";
import { CONFIGS } from "../config/index.js";
import { ErrorMessage } from "../constants/message.js";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(new AppError(401, ErrorMessage.UNAUTHORIZED));
    }
    try {
        const payload = JWT.verify(accessToken, CONFIGS.JWT_SECRET_KEY) as UserPayload;
        req.user = payload;
        next();
    } catch {
        next(new AppError(401, ErrorMessage.UNAUTHORIZED));
    }
}

export default authMiddleware;

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next();
    }
    try {
        const payload = JWT.verify(accessToken, CONFIGS.JWT_SECRET_KEY) as UserPayload;
        req.user = payload;
    } catch {
        // Ignore invalid tokens on optional-auth routes.
    }
    next();
}
