import { User } from "../domain/User";
import { userRepository } from "../repository/user.repository";

class CreateUser {
    userRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    async apply(command: string): Promise<User> {
        const user: User = new User();
        user.id = command;
        user.type = "device";

        return await this.userRepository.createUser(user);
    } 
}

export const createUser = new CreateUser();