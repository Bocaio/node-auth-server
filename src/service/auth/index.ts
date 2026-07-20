import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v7 as uuidv7 } from "uuid";
import { randomInt } from "crypto";

import { ResetPasswordPayload, UserPayload } from "../../types/JwtPayload.js";
import { AppError } from "../../types/AppError.js";
import { CONFIGS } from "../../config/index.js";
import { IRefreshTokenRepository } from "../../repository/redis/refresh-token.js";
import { IOTPRepository } from "../../repository/redis/otp.js";
import { IUserRepository } from "../../repository/mysql/user.js";
import { ErrorMessage } from "../../constants/message.js";
import { ForgetPwVerifyOutput, IAuthService, Login, UserInfo } from "./type.js";

const googleClient = new OAuth2Client();

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    private otpRepository: IOTPRepository;
    private tokenCache: IRefreshTokenRepository;

    constructor(
        userRepository: IUserRepository,
        tokenCache: IRefreshTokenRepository,
        otpRepository: IOTPRepository,
    ) {
        this.userRepository = userRepository;
        this.tokenCache = tokenCache;
        this.otpRepository = otpRepository;
    }

    private signTokens = (payload: UserPayload) => {
        const secret = CONFIGS.JWT_SECRET_KEY;
        const accessToken = jwt.sign(payload, secret, {
            expiresIn: CONFIGS.ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
        });
        const refreshToken = jwt.sign(payload, secret, {
            expiresIn: CONFIGS.REFRESH_TOKEN_TTL as SignOptions["expiresIn"],
        });
        return { accessToken, refreshToken };
    };

    register = async (username: string, email: string, password: string): Promise<UserInfo> => {
        const passwordHash = await bcrypt.hash(password, 10);
        const id = uuidv7();
        await this.userRepository.create(id, username, email, passwordHash);
        return { id, username, email };
    };

    login = async (email: string, password: string): Promise<Login> => {
        const user = await this.userRepository.get(email);
        if (!user) throw new AppError(401, ErrorMessage.INVALID_CREDENTIALS);

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash ?? "");
        if (!isPasswordCorrect) throw new AppError(401, ErrorMessage.INVALID_CREDENTIALS);

        if (!user.is_email_verified) {
            throw new AppError(403, ErrorMessage.EMAIL_NOT_VERIFIED, "EMAIL_NOT_VERIFIED");
        }

        const payload: UserPayload = { userId: user.id, email: user.email };
        const { accessToken, refreshToken } = this.signTokens(payload);

        await this.tokenCache.set(String(user.id), refreshToken);

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, email: user.email },
        };
    };

    googleLogin = async (idToken: string): Promise<Login> => {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: CONFIGS.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.name || !payload.email) {
            throw new AppError(403, ErrorMessage.FORBIDDEN);
        }
        const { sub: googleId, name, email, email_verified } = payload;
        if (!email_verified) {
            throw new AppError(403, ErrorMessage.EMAIL_NOT_VERIFIED);
        }

        const existingUser = await this.userRepository.getGoogleUser(googleId);
        let user: UserInfo;
        if (!existingUser) {
            const uid = uuidv7();
            await this.userRepository.createGoogleUser(uid, name, email, googleId);
            user = { id: uid, username: name, email };
        } else {
            user = { id: existingUser.id, username: existingUser.username, email: existingUser.email };
        }

        const jwtPayload: UserPayload = { userId: user.id, email: user.email };
        const { accessToken, refreshToken } = this.signTokens(jwtPayload);
        await this.tokenCache.set(String(user.id), refreshToken);

        return { accessToken, refreshToken, user };
    };

    refresh = async (token: string): Promise<Login> => {
        if (!token) throw new AppError(401, ErrorMessage.UNAUTHORIZED);

        const payloadData = jwt.verify(token, CONFIGS.JWT_SECRET_KEY) as UserPayload;
        const { email, userId } = payloadData;

        const isTokenExists = await this.tokenCache.isMember(String(userId), token);
        if (!isTokenExists) throw new AppError(401, ErrorMessage.UNAUTHORIZED);

        const user = await this.userRepository.get(email);
        if (!user) throw new AppError(401, ErrorMessage.USER_NOT_FOUND);

        const payload: UserPayload = { userId: user.id, email: user.email };
        const { accessToken, refreshToken } = this.signTokens(payload);

        await this.tokenCache.delete(userId, token);
        await this.tokenCache.set(String(user.id), refreshToken);

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, email: user.email },
        };
    };

    logout = async (token: string): Promise<void> => {
        if (!token) return;
        try {
            const user = jwt.verify(token, CONFIGS.JWT_SECRET_KEY) as UserPayload;
            await this.tokenCache.delete(user.userId, token);
        } catch {
            // Ignore invalid tokens on logout so clients can always clear cookies.
        }
    };

    emailOtpGenerate = async (email: string): Promise<string> => {
        const otp = String(randomInt(100000, 1000000));
        await this.otpRepository.set(email, otp);
        return otp;
    };

    emailOtpVerify = async (email: string, otp: string): Promise<boolean> => {
        const value = await this.otpRepository.get(email);
        if (!value || value !== otp) {
            throw new AppError(401, ErrorMessage.INVALID_OTP);
        }
        const updatedCount = await this.userRepository.update(email, { is_email_verified: true });
        if (updatedCount !== 1) {
            throw new AppError(400, ErrorMessage.EMAIL_ALREADY_VERIFIED);
        }
        return true;
    };

    forgetPwVerify = async (email: string, otp: string): Promise<ForgetPwVerifyOutput> => {
        const value = await this.otpRepository.get(email);
        if (!value || otp !== value) {
            throw new AppError(401, ErrorMessage.INVALID_OTP);
        }
        const payload: ResetPasswordPayload = { email };
        const token = jwt.sign(payload, CONFIGS.JWT_SECRET_KEY, { expiresIn: "5m" });
        return { token };
    };

    resetPassword = async (newPw: string, token: string): Promise<void> => {
        const payload = jwt.verify(token, CONFIGS.JWT_SECRET_KEY) as ResetPasswordPayload;
        const { email } = payload;
        const passwordHash = await bcrypt.hash(newPw, 10);
        const updatedCount = await this.userRepository.update(email, { password_hash: passwordHash });
        if (updatedCount !== 1) {
            throw new AppError(400, "Failed to reset password");
        }
    };
}
