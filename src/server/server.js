global.__IS_SERVER__ = true;
global.__IS_CLIENT__ = false;

import koa from 'koa';
import KoaRouter from 'koa-router'
var app = koa();
var router = KoaRouter();

// x-response-time

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s ds- %s', this.method, this.url, ms);
});

// response

app.use(function *(){
  this.body = 'Hello ds World';
});

app.listen(3000);