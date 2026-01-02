import Koa from 'koa';
import bodyParser from 'koa-bodyparser'; 

const app = new Koa();

app.use(bodyParser());

app.use(async ctx => {
   ctx.body = {"hello": "world"}; 
})

app.listen(8080);