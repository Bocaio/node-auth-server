import z from "zod";
import { ValidateBody } from "../index.js";

const registerSchema = z.object({
    username: z.string().min(3, "Username too short").max(30, "Username too long"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const resendOTPSchema = z.object({
    email: z.email(),
});

const verifyOTPSchema = z.object({
    email: z.email(),
    otp: z.string().length(6),
});

const forgetPwSchema = z.object({
    email: z.email(),
});

const forgetPwVerifySchema = z.object({
    email: z.email(),
    otp: z.string().length(6),
});

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    token: z.jwt(),
});

export const validateRegister = ValidateBody(registerSchema);
export const validateLogin = ValidateBody(loginSchema);
export const validateResendOTP = ValidateBody(resendOTPSchema);
export const validateVerifyOTP = ValidateBody(verifyOTPSchema);
export const validateForgetPw = ValidateBody(forgetPwSchema);
export const validateForgetPwVerify = ValidateBody(forgetPwVerifySchema);
export const validateResetPwSchema = ValidateBody(resetPasswordSchema);
