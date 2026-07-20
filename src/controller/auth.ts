import { Request, Response, NextFunction } from "express";
import { clearAuthCookies, sendSuccess, setAuthCookies } from "../utils/helper.js";
import { EmailProducerType } from "../worker/email/producer.js";
import { AppError } from "../types/AppError.js";
import { EmailServiceType } from "../service/email/type.js";
import { IAuthService } from "../service/auth/type.js";
import { ErrorMessage, SuccessMessage } from "../constants/message.js";

export class AuthController {
    private authService: IAuthService;
    private emailService: EmailServiceType;
    private queue: EmailProducerType;

    constructor(
        authService: IAuthService,
        queue: EmailProducerType,
        emailService: EmailServiceType,
    ) {
        this.authService = authService;
        this.queue = queue;
        this.emailService = emailService;
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body;
            const data = await this.authService.register(username, email, password);
            await this.queue.enqueue({ name: username, email });
            const otp = await this.authService.emailOtpGenerate(email);
            await this.emailService.sendOTP(email, otp);
            sendSuccess(res, data, 201, { message: SuccessMessage.SIGNUP_VERIFY_EMAIL });
        } catch (err) {
            next(err);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const data = await this.authService.login(email, password);
            setAuthCookies(res, data.accessToken, data.refreshToken);
            sendSuccess(res, data.user, 200, { message: SuccessMessage.LOGIN_SUCCESS });
        } catch (err) {
            if (err instanceof AppError && err.code === "EMAIL_NOT_VERIFIED") {
                const otp = await this.authService.emailOtpGenerate(email);
                await this.emailService.sendOTP(email, otp);
            }
            next(err);
        }
    };

    google = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.credential;
            if (!token) throw new AppError(401, ErrorMessage.TOKEN_NOT_FOUND);
            const data = await this.authService.googleLogin(token);
            setAuthCookies(res, data.accessToken, data.refreshToken);
            sendSuccess(res, data.user, 200, { message: SuccessMessage.LOGIN_SUCCESS });
        } catch (err) {
            next(err);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = await this.authService.refresh(refreshToken);
            setAuthCookies(res, data.accessToken, data.refreshToken);
            sendSuccess(res, data.user, 200);
        } catch (err) {
            next(err);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            await this.authService.logout(refreshToken);
            clearAuthCookies(res);
            sendSuccess(res, {}, 200, { message: SuccessMessage.LOGOUT_SUCCESS });
        } catch (err) {
            next(err);
        }
    };

    forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const otp = await this.authService.emailOtpGenerate(email);
            await this.emailService.sendOTP(email, otp);
            sendSuccess(res, {}, 200, { message: SuccessMessage.OTP_SENT });
        } catch (err) {
            next(err);
        }
    };

    forgetPwVerify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            const { token } = await this.authService.forgetPwVerify(email, otp);
            sendSuccess(res, { token }, 200);
        } catch (err) {
            next(err);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { newPassword, token } = req.body;
            await this.authService.resetPassword(newPassword, token);
            sendSuccess(res, {}, 200, { message: SuccessMessage.PASSWORD_CHANGED });
        } catch (err) {
            next(err);
        }
    };

    emailOtpResend = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const otp = await this.authService.emailOtpGenerate(email);
            await this.emailService.sendOTP(email, otp);
            sendSuccess(res, {}, 200, { message: SuccessMessage.OTP_SENT });
        } catch (err) {
            next(err);
        }
    };

    emailOtpVerify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this.authService.emailOtpVerify(email, otp);
            sendSuccess(res, {}, 200, { message: SuccessMessage.EMAIL_VERIFIED });
        } catch (err) {
            next(err);
        }
    };
}
