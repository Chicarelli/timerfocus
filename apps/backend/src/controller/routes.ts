
import type { Context } from 'koa';
import * as z from 'zod';
import { getUserCycleConfig } from '../application/getUserCycleConfig';
import { CycleConfigValidator } from './validations/editCycleConfig.validation';
import { editUserCycleConfig } from '../application/editUserCycleConfig';
import { CycleConfig } from '../domain/CycleConfig';
import { cycleConfigRepository } from '../repository/cycle-config.repository';

export const routes = [
    {
        method: "get" as const,
        route: "/user/:id/cycle-config",
        handler: getUserConfigHandler
    },
    {
        method: "post" as const,
        route: "/user/:id/cycle-config",
        validation: await validate(CycleConfigValidator),
        handler: editUserConfigHandler
    },
    {
        method: 'post' as const,
        route: 'user/:id/cycle/start',
        handler: () => { }
    },
    {
        method: 'post' as const,
        route: 'user/:id/cycle/:cycle_id/events',
        handler: () => { }
    }
]

async function validate(object: z.ZodObject) {
    return async function (ctx: Context, next: any) {
        const body = ctx.request.body;
        const data = object.safeParse(body);

        if (!data.success && data.error?.issues) {
            ctx.status = 422,
                ctx.body = {
                    error: true,
                    errors: {
                        [data.error?.issues[0].path[0]]: data.error?.issues[0].message
                    }
                }
            return
        }
        if (!data.success) {
            ctx.status = 422
            ctx.body = {
                error: true,
                errors: {
                    message: 'Requisição inválida, tente novamente'
                }
            }
            return
        }

        next();
    }
}

async function getUserConfigHandler(ctx: Context, next: any) {
    const id = ctx.params.id;

    console.log(`Searching cycle config from user ${id}`);
    const result = await getUserCycleConfig.apply(id);
    
    ctx.body = result;
    await next();
}

async function editUserConfigHandler(ctx: Context, next: any) {
    const body = ctx.request.body;
    const id = ctx.params.id;

    if (!id) return;

    const cycle = new  CycleConfig();
    cycle.userId = id
    cycle.mode = body.mode;
    cycle.workTime = body.workTime;
    cycle.thoughfulWorkTime = body.thoughfulWorkTime;
    cycle.shortBreakTime = body.shortBreakTime;
    cycle.longBreakTime = body.longBreakTime;
    cycle.shortIntervalCount = body.shortIntervalCount;
    const result = await editUserCycleConfig.apply(cycle)

    ctx.body = result
    await next();
}