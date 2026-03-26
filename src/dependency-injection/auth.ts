import { UserRepository } from "../repository/user.js";
import { UserService } from "../service/auth.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export { userService }

