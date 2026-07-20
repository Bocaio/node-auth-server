import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
    userId: string;
    email: string;
}

export interface ResetPasswordPayload extends JwtPayload {
    email: string
}