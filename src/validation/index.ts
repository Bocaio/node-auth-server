import { RequestHandler, Request, Response, NextFunction } from "express";
import z from "zod";
import { ValidationError } from "../types/valideError.js";

const buildValidationError = (error: z.ZodError) => {
    const errorMessages = error.issues.map((issue) => ({
        field: issue.path.join(".") || "unknown",
        message: issue.message,
    }));
    return new ValidationError("Validation failed", errorMessages);
};

export const ValidateRouteParams = (schema: z.ZodType): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const check = schema.safeParse(req.params);
        if (!check.success) {
            next(buildValidationError(check.error));
        } else {
            next();
        }
    };
};

export const ValidateBody = (schema: z.ZodType): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const check = schema.safeParse(req.body);
        if (!check.success) {
            next(buildValidationError(check.error));
            return;
        }
        next();
    };
};

export const ValidateQueryParams = (schema: z.ZodType): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const check = schema.safeParse(req.query);
        if (!check.success) {
            next(buildValidationError(check.error));
            return;
        }
        req.validateQuery = check.data as Record<string, string>;
        next();
    };
};
