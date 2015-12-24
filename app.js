var path = require('path');
var http = require('http');
var koa = require('koa');
var serve = require('koa-static');
var proxy = require('koa-proxy');
var send = require('koa-send');
var router = require('koa-router')();

var port = 3000;

var app = koa();

router.get('/',function *(next){
  yield send(this,'./index.html');
});
app.use(router.routes()).use(router.allowedMethods());;
// 处理静态资源和入口文件
app.use(serve(path.resolve(__dirname, 'dest'), {
  maxage: 0
}));

app = http.createServer(app.callback());

app.listen(port, function() {
  console.log('app listen success.');
});
