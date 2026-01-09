import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { oas } from 'koa-oas3';

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
   const app = new Koa();

   app.use(bodyParser());

   const oasMw = await oas({
      file: `${__dirname}/../openapi.yaml`,
      endpoint: '/openapi.json',
      uiEndpoint: '/'
   })

   app.use(oasMw);

   app.use(async ctx => {
      ctx.body = { "hello": "world" };
   })

   app.listen(8081);
}

main().catch(err => {
   console.error('Failed to start server:', err)
   process.exit(1)
})