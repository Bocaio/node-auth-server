import { UserRepositoryType } from "../repository/sql/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/JwtPayload.js";
import { AppError } from "../types/AppError.js";
import { CONFIGS } from "../config/index.js";
import { OAuth2Client } from "google-auth-library";
import { RefreshTokenRepositoryType } from "../repository/redis/refresh-token.js";

const client = new OAuth2Client();

interface UserServiceType {
    register: (username: string, email: string, password: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    googleLogin: (idToken: string) => Promise<any>;
    refresh: (token: string) => Promise<any>
}

class UserService {
    private userRepository: UserRepositoryType;
    private tokenCache: RefreshTokenRepositoryType;
    constructor(userRepository: UserRepositoryType, tokenCache: RefreshTokenRepositoryType) {
        this.userRepository = userRepository;
        this.tokenCache = tokenCache;
    }

    register = async (username: string, email: string, password: string) => {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create(username, email, passwordHash);
        return {
            id: user.insertId,
            username,
            email,
        };
    }
    login = async (email: string, password: string) => {
        const user = await this.userRepository.get(email);
        if (!user) {
            throw new AppError(401, "Invalid Email or Password")
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            throw new AppError(401, "Invalid Email or Password")
        }

        const jwtKey = CONFIGS.JWT_SECRET_KEY;
        const payload: UserPayload = { userId: user.id, email: user.email };
        const accessToken = jwt.sign(payload, jwtKey, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, jwtKey, { expiresIn: "7d" });

        await this.tokenCache.set(String(user.id), refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
    googleLogin = async (idToken: string) => {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CONFIGS.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload();
        if (!payload || !payload.name || !payload.email) {
            throw new AppError(403, "Forbidden")
        }
        const { sub: googleId, name, email, email_verified } = payload;
        if (!email_verified) {
            throw new AppError(403, "Email not verified")
        }
        let user = await this.userRepository.getGoogleUser(googleId);
        if (!user) {
            await this.userRepository.createGoogleUser(name, email, googleId);
            user = await this.userRepository.getGoogleUser(googleId);
        }
        const jwtKey = CONFIGS.JWT_SECRET_KEY;
        const jwtPayload: UserPayload = { userId: user.id, email: user.email };
        const accessToken = jwt.sign(jwtPayload, jwtKey, { expiresIn: "15m" });
        const refreshToken = jwt.sign(jwtPayload, jwtKey, { expiresIn: "7d" });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    refresh = async (token: string) => {
        if (!token) throw new AppError(401, "Unauthorized")

        const payloadData = jwt.verify(token, CONFIGS.JWT_SECRET_KEY) as UserPayload;
        const { email, userId } = payloadData;
        const isTokenExists = await this.tokenCache.isMember(String(userId), token)
        if (!isTokenExists) throw new AppError(401, "Unauthorized")

        const user = await this.userRepository.get(email);
        if (!user) throw new AppError(401, "No user found")

        const jwtKey = CONFIGS.JWT_SECRET_KEY;
        const payload: UserPayload = { userId: user.id, email: user.email }
        const accessToken = jwt.sign(payload, jwtKey, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, jwtKey, { expiresIn: "7d" });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
}

export { UserService, UserServiceType }

