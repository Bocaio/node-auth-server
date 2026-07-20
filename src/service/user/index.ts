import { IUserRepository } from "../../repository/mysql/user.js";
import { AppError } from "../../types/AppError.js";
import { IUserService, User } from "./type.js";
import { ErrorMessage } from "../../constants/message.js";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    getUser = async (email: string): Promise<User> => {
        const user = await this.userRepository.get(email);
        if (!user) {
            throw new AppError(404, ErrorMessage.USER_NOT_FOUND);
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.created_at,
        };
    };
}
