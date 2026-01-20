import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { oas } from 'koa-oas3';
import { fileURLToPath } from 'url'
import path from 'path'
import { routes } from './controller/routes.ts';
import Router from '@koa/router';
import { NotFoundException } from './application/errors/NotFoundException.ts';
import { AppError } from './domain/AppError.ts';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
   const app = new Koa();
   const router = new Router();

   app.use(bodyParser());

   routes.forEach((route) => {

      if (route.validation) {
         router[route.method](route.route, route.validation, route.handler);
      } else {
         router[route.method](route.route, route.handler);
      }
   })

   app.use(async (ctx: Context, next: any) => {
      try {
         await next();
      }
      catch (error) {
         if (error instanceof AppError) {
            ctx.status = error.status;
            ctx.body = { message: error.message }
            return;
         }

         ctx.status = 500;
         ctx.body = { message: 'Unexpected error' };
         ctx.app.emit('error', error, ctx);
      }
   })

   app.on('error', (err, ctx) => {
      console.error('Request failed:', {
         method: ctx.method,
         url: ctx.url,
         status: ctx.status,
         message: err.message,
         stack: err.stack
      })
   })

   app.use(router.routes()).use(router.allowedMethods())

   const oasMw = await oas({
      file: `${__dirname}/../openapi.yaml`,
      endpoint: '/openapi.json',
      uiEndpoint: '/docs'
   })
   app.use(oasMw);
   app.listen(8080, () => console.log(`running 8080`));
}

main().catch(err => {
   console.error('Failed to start server:', err)
   process.exit(1)
})