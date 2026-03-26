import { UserPayload } from "./JwtPayload.ts";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}