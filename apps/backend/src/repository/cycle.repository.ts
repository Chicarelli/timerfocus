import { Cycle } from "../domain/Cycle";

class CycleRepository {
    collection: Array<Cycle>;

    constructor() {
        this.collection = [];
    }

    async createCycle(newCycle: Cycle): Promise<Cycle> {
        this.collection.push(newCycle);

        console.log(this.collection);

        return newCycle;
    }

    async findCycle(id: string): Promise<Cycle | null> {
        const foundCycle = this.collection.find(cycle => cycle.id === id);

        return foundCycle || null;
    }

    async updateCycle(updatedCycle: Cycle): Promise<Cycle> {
        this.collection.forEach(cycle => {
            if (cycle.id === updatedCycle.id) {
                Object.assign(cycle, updatedCycle);
            }
        })

        console.log(this.collection);

        return updatedCycle;
    }
}