import { Cycle } from "../domain/Cycle";

class CycleConfigRepository {
    collection: Array<Cycle>;

    constructor() {
        this.collection = [];
    }

    async findUserConfig(userId: string): Promise<Cycle | null> {
        const cycle = this.collection.find(configs => configs.userId === userId);
        return cycle || null;
    }

    async editUserCycleConfig(newCycle: Cycle) {
        this.collection.forEach(cycle => {
            if (cycle.id === newCycle.id) {
                Object.assign(cycle, newCycle);
            }
        })
    } 

}