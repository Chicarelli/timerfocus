import * as zod from 'zod';

export const CycleEventValidator = zod.z.object({
    type: zod.z.literal(["heartbeat", "pause", "unpause", "end"])
})