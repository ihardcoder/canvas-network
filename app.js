var path = require('path');
var http = require('http');
var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router')();
var routes = require('./routes');
var port = 3000;

var app = koa();

routes(router, app);
app.use(router.routes());
app.use(router.routes());
// 处理静态资源和入口文件
app.use(serve(path.resolve(__dirname, 'dest'), {
  maxage: 0
}));

app = http.createServer(app.callback());

app.listen(port, function() {
  console.log('app listen success.');
});
