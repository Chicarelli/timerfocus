import { nanoid } from "nanoid";

export class Cycle {
    id: string = "";
    userId: string = "";
    type: "default" | "learning" = "default";
    startedAt: Date = new Date();
    endedAt: Date | null = null;
    lastHeartbeatAt: Date | null = null;
    accumulateSeconds: number = 0;
    maxAllowedSeconds: number = 0;
    status: "running" | "paused" | "ended" = "running";
    pauses: number = 0;
    endedReason: "manual" | "timeout" | "max_time_reached" | "new_cycle_started" | null = null;


    generateId() {
        this.id = nanoid(8);
    }
}