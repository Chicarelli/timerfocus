import { Cycle } from "../domain/Cycle";

class CycleRepository {
    collection: Array<Cycle>;

    constructor() {
        this.collection = [];
    }

    async createCycle(newCycle: Cycle): Promise<Cycle> {
        this.collection.push(newCycle);

        return newCycle;
    }

    async findCycle(id: string): Promise<Cycle | null> {
        const foundCycle = this.collection.find(cycle => cycle.id === id);

        return foundCycle || null;
    }

    async findByUserIdAndStatus(userId: string, status: Cycle["status"]): Promise<Cycle[]> {
        const foundCycle = this.collection.filter(cycle => cycle.userId === userId && cycle.status === status);

        return foundCycle
    }

    async updateCycle(updatedCycle: Cycle): Promise<Cycle> {
        this.collection.forEach(cycle => {
            if (cycle.id === updatedCycle.id) {
                Object.assign(cycle, updatedCycle);
            }
        })

        return updatedCycle;
    }
}

export const cycleRepository = new CycleRepository();