import { Router } from "express";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import {
    validateForgetPw,
    validateForgetPwVerify,
    validateLogin,
    validateRegister,
    validateResendOTP,
    validateResetPwSchema,
    validateVerifyOTP,
} from "../validation/auth/auth.validation.js";
import { authController } from "../dependency-injection/controller.js";

const router = Router();

router.post("/register", validateRegister, (req, res, next) => authController.create(req, res, next));
router.post("/login", validateLogin, (req, res, next) => authController.login(req, res, next));
router.post("/google", verifyCSRFToken, (req, res, next) => authController.google(req, res, next));
router.post("/refresh", (req, res, next) => authController.refresh(req, res, next));
router.post("/logout", (req, res, next) => authController.logout(req, res, next));

router.post("/email/otp/resend", validateResendOTP, (req, res, next) => authController.emailOtpResend(req, res, next));
router.post("/email/otp/verify", validateVerifyOTP, (req, res, next) => authController.emailOtpVerify(req, res, next));

router.post("/password/forget", validateForgetPw, (req, res, next) => authController.forgetPassword(req, res, next));
router.post("/password/verify", validateForgetPwVerify, (req, res, next) => authController.forgetPwVerify(req, res, next));
router.put("/password/reset", validateResetPwSchema, (req, res, next) => authController.resetPassword(req, res, next));

export default router;
