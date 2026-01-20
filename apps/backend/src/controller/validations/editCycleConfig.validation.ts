import * as z from 'zod';

export const CycleConfigValidator = z.object({
    mode: z.literal(["default", "learning"]),
    workTime: z.number().positive().gt(0).lte(120),
    thoughfulWorkTime: z.number().positive().gt(0).lte(120),
    shortBreakTime: z.number().positive().gt(0).lte(120),
    longBreakTime: z.number().positive().gt(0).lte(120),
    shortIntervalCount: z.number().positive().gte(0).lte(15),
}) 