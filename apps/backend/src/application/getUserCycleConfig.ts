import { cycleConfigRepository } from "../repository/cycle-config.repository";
import { createUser } from "./createUser";
import { createUserCycleConfig } from "./createUserCycleConfig";

class GetUserCycleConfig {
    cycleConfigRepository;
    createUser;


    constructor() {
        this.cycleConfigRepository = cycleConfigRepository
        this.createUser = createUser;
    }

    async apply(command: string) {
        const foundUserCycle = await this.cycleConfigRepository.findUserConfig(command);

        if (foundUserCycle) {
            return foundUserCycle;
        }

        const user = await createUser.apply(command);
        const cycleConfig = await createUserCycleConfig.apply(user.id);
        
        return cycleConfig;
    }

}

export const getUserCycleConfig = new GetUserCycleConfig();