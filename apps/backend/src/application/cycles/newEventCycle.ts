import { Cycle } from "../../domain/Cycle";
import { cycleConfigRepository } from "../../repository/cycle-config.repository";
import { cycleRepository } from "../../repository/cycle.repository";
import { differenceInSeconds } from 'date-fns';


class NewEventCycle {
    cycleRepository;
    userCycleConfig;

    constructor() {
        this.cycleRepository = cycleRepository;
        this.userCycleConfig = cycleConfigRepository;
    }

    async apply(cycleId: string, event: 'heartbeat' | 'pause' | 'unpause' | 'end'): Promise<Cycle | { error: string }> {
        const cycle = await this.cycleRepository.findCycle(cycleId);

        if (!cycle) {
            return {
                error: "Cycle not found"
            }
        }

        if (event === "heartbeat") {
            return await this.heartbeatEvent(cycle);
        }

        if (event === "pause") {
            return await this.pauseEvent(cycle);
        }

        if (event === "unpause") {
            return await this.unpauseEvent(cycle);
        }

        if (event === "end") {
            return await this.endEvent(cycle);
        }

        return {
                error: 'Ocorreu um erro geral ao tentar registrar o evento'
            }
    }

    async heartbeatEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();
        if (cycle.status !== "running" || differenceInSeconds(now, cycle.lastHeartbeatAt as Date) > 8) {
            return {
                error: 'Ocorreu um erro ao tentar registrar o evento de heartbeat'
            }
        }

        cycle.accumulateSeconds = cycle.accumulateSeconds + 5;
        cycle.lastHeartbeatAt = now;
        
        if (cycle.accumulateSeconds >= cycle.maxAllowedSeconds) {
            cycle.endedAt = now;
            cycle.status = "ended";
            cycle.endedReason = "max_time_reached";
            cycle.accumulateSeconds = cycle.maxAllowedSeconds;
        }

        return this.cycleRepository.updateCycle(cycle);
    }

    async pauseEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();
        if (cycle.status !== "running") {
            return {
                error: 'Ocorreu um erro ao tentar registrar o evento de pause' 
            }
        }

        cycle.status = "paused";
        cycle.pauses = cycle.pauses + 1;
        const secondsToAdd = differenceInSeconds(now, cycle.lastHeartbeatAt as Date);
        cycle.accumulateSeconds = cycle.accumulateSeconds + secondsToAdd;

        if (cycle.accumulateSeconds >= cycle.maxAllowedSeconds) {
            cycle.endedAt = now;
            cycle.status = "ended";
            cycle.endedReason = "max_time_reached";
            cycle.accumulateSeconds = cycle.maxAllowedSeconds;
        }

        return this.cycleRepository.updateCycle(cycle);
    }

    async unpauseEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();

        if (cycle.status !== "paused") {
            return {
                error: 'Ocorreu um erro ao tentar registrar o evento de unpause'
            }
        }

        cycle.status = "running";
        cycle.lastHeartbeatAt = now;

        return this.cycleRepository.updateCycle(cycle);
    }

    async endEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();

        if (cycle.status === "ended") {
            return {
                error: 'Ocorreu um erro ao tentar registrar o evento de end'
            }
        }

        cycle.status = "ended";
        cycle.endedAt = now;
        cycle.endedReason = "manual";

        return this.cycleRepository.updateCycle(cycle);
    }
}

export const newEventCycle = new NewEventCycle();