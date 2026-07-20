import { Request, Response, NextFunction } from "express";
import { IUserService } from "../service/user/type.js";
import { UserPayload } from "../types/JwtPayload.js";
import { sendSuccess } from "../utils/helper.js";

export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.user as UserPayload;
            const data = await this.userService.getUser(email);
            sendSuccess(res, data, 200);
        } catch (err) {
            next(err);
        }
    };
}
