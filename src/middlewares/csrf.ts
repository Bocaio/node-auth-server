import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/AppError.js";
import { ErrorMessage } from "../constants/message.js";

export function verifyCSRFToken(req: Request, res: Response, next: NextFunction) {
    const csrfCookie = req.cookies["g_csrf_token"];
    const csrfBody = req.body["g_csrf_token"];

    if (!csrfCookie || !csrfBody) {
        return next(new AppError(401, ErrorMessage.FORBIDDEN));
    }

    if (csrfCookie !== csrfBody) {
        return next(new AppError(401, ErrorMessage.FORBIDDEN));
    }

    next();
}
