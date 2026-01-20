import { Cycle } from "../../domain/Cycle";
import { cycleConfigRepository } from "../../repository/cycle-config.repository";
import { cycleRepository } from "../../repository/cycle.repository";


class StartCycle {
    cycleRepository;
    userCycleConfig;

    constructor() {
        this.cycleRepository = cycleRepository;
        this.userCycleConfig = cycleConfigRepository;
    }

    async apply(userId: string, type: Cycle["type"]) {
        const cycleConfig = await this.userCycleConfig.findUserConfig(userId);

        if (!cycleConfig) {
            return {
                error: "Cycle config not found for this user"
            }
        }

        //"check if user has a running cycle to ended"
        const runningCycles = await this.cycleRepository.findByUserIdAndStatus(userId, "running");
        const stoppedCycles = await this.cycleRepository.findByUserIdAndStatus(userId, "paused");

        console.log(`${runningCycles.length} running cycles and ${stoppedCycles.length} stopped cycles to be stopped`)

        for (const cyc of [...runningCycles, ...stoppedCycles]) {
            cyc.status = "ended";
            cyc.endedAt = new Date();
            cyc.endedReason = "new_cycle_started"

            await this.cycleRepository.updateCycle(cyc);
        }


        const cycle = new Cycle()
        cycle.generateId();
        cycle.userId = userId;
        cycle.type = cycleConfig.mode;
        cycle.startedAt = new Date();
        cycle.lastHeartbeatAt = new Date();
        cycle.maxAllowedSeconds = cycleConfig[type === "default" ? "thoughfulWorkTime" : "workTime"] * 60;
        cycle.pauses = 0;

        console.log(`new cycle created`, cycle);
        return await this.cycleRepository.createCycle(cycle)
    }
}



export const startCycle = new StartCycle();