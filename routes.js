var proxy = require('koa-proxy');
var send = require('koa-send');

module.exports = function(router, app) {
  router.get('/',function *(next){
    yield send(this,'./index.html');
  });
}
