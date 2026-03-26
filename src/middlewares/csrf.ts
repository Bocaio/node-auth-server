import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/AppError.js";


export function verifyCSRFToken(req: Request, res: Response, next: NextFunction) {
    const csrfCookie = req.cookies["g_csrf_token"];
    const csrfBody = req.body["g_csrf_token"];

    if (!csrfCookie || !csrfBody) {
        throw new AppError(401, "Forbidden")
    }

    if (csrfCookie !== csrfBody) {
        throw new AppError(401, "Forbidden")
    }

    next();
}