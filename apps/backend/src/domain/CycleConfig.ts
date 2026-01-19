import { nanoid } from "nanoid";

export class CycleConfig {
    userId: string = "";
    mode: "default" |  "learning" = "default";
    workTime: number = 25;
    thoughfulWorkTime: number = 25;
    shortBreakTime: number = 5;
    longBreakTime: number = 15;
    shortIntervalCount: number = 4;
}