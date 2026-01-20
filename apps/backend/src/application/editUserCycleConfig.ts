import { CycleConfig } from "../domain/CycleConfig";
import { cycleConfigRepository } from "../repository/cycle-config.repository";
import { NotFoundException } from "./errors/NotFoundException";


class EditUserCycleConfig {
    cycleConfigRepository;

    constructor() {
        this.cycleConfigRepository = cycleConfigRepository
    }

    async apply(newCycle: CycleConfig) {
        const foundCycle = await this.cycleConfigRepository.findUserConfig(newCycle.userId);
        if (!foundCycle) {
            throw new NotFoundException("Config not found for this user");
        }

        return await this.cycleConfigRepository.editUserCycleConfig(newCycle);
    }
}

export const editUserCycleConfig = new EditUserCycleConfig();