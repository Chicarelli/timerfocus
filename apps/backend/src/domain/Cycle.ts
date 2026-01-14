import { nanoid } from "nanoid";

export class Cycle {
    id: string = "";
    userId: string = "";
    mode: "default" |  "learning" = "default";
    workTime: number = 25;
    thoughfulWorkTime: number = 25;
    shortBreakTime: number = 5;
    longBreakTime: number = 15;
    shortIntervalCount: number = 4;

    generateId() {
        this.id = nanoid(8);
    }
}