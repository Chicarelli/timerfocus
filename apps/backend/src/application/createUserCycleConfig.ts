import { CycleConfig } from "../domain/CycleConfig";
import { cycleConfigRepository } from "../repository/cycle-config.repository";


class CreateUserCycleConfig {
    cycleConfigRepository;

    constructor() {
        this.cycleConfigRepository = cycleConfigRepository;
    }


    async apply(command: string): Promise<CycleConfig> {
        const newCycle = new CycleConfig();
        newCycle.userId = command;

        return await this.cycleConfigRepository.createConfig(newCycle);
    }
}


export const createUserCycleConfig = new CreateUserCycleConfig();