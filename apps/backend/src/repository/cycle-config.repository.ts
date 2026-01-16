import { CycleConfig } from "../domain/CycleConfig";

class CycleConfigRepository {
    collection: Array<CycleConfig>;

    constructor() {
        this.collection = [];
    }

    async createConfig(newConfig: CycleConfig): Promise<CycleConfig> {
        const foundUserConfig = this.collection.find(config => config.userId === newConfig.userId)

        if (foundUserConfig) throw new Error("This user already have a config");

        this.collection.push(newConfig);
        return newConfig;
    }

    async findUserConfig(userId: string): Promise<CycleConfig | null> {
        const cycle = this.collection.find(configs => configs.userId === userId);
        return cycle || null;
    }

    async editUserCycleConfig(newCycle: CycleConfig) {
        this.collection.forEach(cycle => {
            if (cycle.id === newCycle.id) {
                Object.assign(cycle, newCycle);
            }
        })
    }

}

export const cycleConfigRepository = new CycleConfigRepository();