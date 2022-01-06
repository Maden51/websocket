const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const WS = require('ws');

const app = new Koa();
app.use(cors());
app.use(koaBody({json: true}));

const port = process.env.PORT || 8080;
const router = new Router();

router.get('/index', async (ctx) => {
    ctx.response.body = 'hello';
  });


app.use(router.routes()).use(router.allowedMethods());
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

wsServer.on('connection', (ws, req) => {
    ws.on('message', msg => {
        [...wsServer.clients]
            .filter(c => c.readyState === WS.OPEN)
            .forEach(c => c.send('to all', msg))
    });
    ws.send('welcome');
});


server.listen(port);