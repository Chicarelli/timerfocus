import { Cycle } from "../../domain/Cycle";
import { cycleConfigRepository } from "../../repository/cycle-config.repository";
import { cycleRepository } from "../../repository/cycle.repository";
import { differenceInSeconds } from 'date-fns';
import { InvalidCycleException } from "../errors/InvalidCycleException";
import { NotFoundException } from "../errors/NotFoundException";


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
            throw new NotFoundException("Cycle not found")
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

        throw new InvalidCycleException("Invalid event");
    }

    async heartbeatEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();
        if (cycle.status !== "running" || differenceInSeconds(now, cycle.lastHeartbeatAt as Date) > 8) {
            throw new InvalidCycleException("Invalid event for this cycle")
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
            throw new InvalidCycleException("Invalid event for this cycle")
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
          throw new InvalidCycleException("Invalid event for this cycle")
        }

        cycle.status = "running";
        cycle.lastHeartbeatAt = now;

        return this.cycleRepository.updateCycle(cycle);
    }

    async endEvent(cycle: Cycle): Promise<Cycle | { error: string }> {
        const now = new Date();

        if (cycle.status === "ended") {
            throw new InvalidCycleException("Invalid event for this cycle")
        }

        cycle.status = "ended";
        cycle.endedAt = now;
        cycle.endedReason = "manual";

        return this.cycleRepository.updateCycle(cycle);
    }
}

export const newEventCycle = new NewEventCycle();