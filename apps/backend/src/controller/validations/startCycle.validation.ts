import * as zod from 'zod';

export const StartCycleValidator = zod.z.object({
    type: zod.z.literal(["default", "learning"])
})