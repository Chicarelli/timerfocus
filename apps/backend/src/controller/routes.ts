
import type { Context } from 'koa';
import * as z from 'zod';

const User = z.object({
    name: z.string().nonoptional()
})

export const routes = [
    {
        method: "get" as const,
        route: "/user/:id/cycle-config",
        handler: getUserConfigHandler
    },
    {
        method: "post" as const,
        route: "/user/:id/cycle-config",
        validation: await validate(User),
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
        console.log('validating body', body);

        const data = object.safeParse(body);
        console.log(data);
        console.log(data.error?.issues);

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
    const body = ctx.request.body;
    console.log(body);
    ctx.body = { result: "get user config was successfull" }
    await next();
}

async function editUserConfigHandler(ctx: Context, next: any) {
    const body = ctx.request.body;

    console.log(body);

    ctx.body = { result: "edit user config was successfull" }
    await next();
}