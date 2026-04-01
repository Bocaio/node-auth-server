import { UserServiceType } from "../service/auth.js";
import { Request, Response, NextFunction } from "express";
import { successHandler } from "../utils/helper.js";
import { EmailProducerType } from "../worker/email/producer.js";


class UserController {
    private userService: UserServiceType;
    private queue: EmailProducerType;
    constructor(userService: UserServiceType, queue: EmailProducerType) {
        this.userService = userService;
        this.queue = queue;
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body;
            const data = await this.userService.register(username, email, password);
            await this.queue.enqueueJob({ name: username, email: email });
            successHandler(res, data, "create")
        } catch (err) {
            next(err)
        }
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const data = await this.userService.login(email, password);
            successHandler(res, data, "login");
        } catch (err) {
            next(err)
        }
    }
    google = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.credential;
            const data = await this.userService.googleLogin(token);
            successHandler(res, data, "google-login");
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = await this.userService.refresh(refreshToken)
            successHandler(res, data, "refresh")
        } catch (err) {
            next(err)
        }
    }
}

export { UserController }