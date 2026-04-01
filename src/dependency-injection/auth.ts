import { RefreshTokenRepository } from "../repository/redis/refresh-token.js";
import { UserRepository } from "../repository/sql/user.js";
import { UserService } from "../service/auth.js";

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const userService = new UserService(userRepository, refreshTokenRepository);

export { userService }

