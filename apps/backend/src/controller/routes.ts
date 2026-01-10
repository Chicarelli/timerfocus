
import type { Context } from 'koa';

export const routes = [
    {
        method: "get" as const,
        route: "/user/:id/cycle-config",
        handler: getUserConfigHandler
    }, 
    {
        method: "post" as const,
        route: "/user/:id/cycle-config",
        handler: editUserConfigHandler
    }
]


async function getUserConfigHandler(ctx: Context, next: any) {
    const body = ctx.request.body;
    console.log(body);
    ctx.body = {result: "get user config was successfull"}
    await next();
}


async function editUserConfigHandler(ctx: Context, next: any) {
    const body = ctx.request.body;

    console.log(body);

    ctx.body = {result: "edit user config was successfull"}
    await next();
}