import { CycleConfig } from "../domain/CycleConfig";
import { cycleConfigRepository } from "../repository/cycle-config.repository";


class EditUserCycleConfig {
    cycleConfigRepository;

    constructor() {
        this.cycleConfigRepository = cycleConfigRepository
    }

    async apply(newCycle: CycleConfig) {
        const foundCycle = await this.cycleConfigRepository.findUserConfig(newCycle.userId);
        if (!foundCycle) {
            return {
                message: "Not found",
            }
        }

        return await this.cycleConfigRepository.editUserCycleConfig(newCycle);
    }
}

export const editUserCycleConfig = new EditUserCycleConfig();