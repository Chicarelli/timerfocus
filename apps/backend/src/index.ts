import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { oas } from 'koa-oas3';
import { fileURLToPath } from 'url'
import path from 'path'
import { routes } from './controller/routes.ts';
import Router from '@koa/router';

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