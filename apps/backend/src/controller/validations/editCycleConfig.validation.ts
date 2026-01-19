import * as z from 'zod';

export const CycleConfigValidator = z.object({
    userId: z.uuidv4(),
    mode: z.literal(["default", "learning"]),
    workTime: z.number().positive().gt(0).lte(120),
    thoughfulWork: z.number().positive().gt(0).lte(120),
    shortBreak: z.number().positive().gt(0).lte(120),
    longBreak: z.number().positive().gt(0).lte(120),
    shortIntervalCounts: z.number().positive().gte(0).lte(15),
}) 