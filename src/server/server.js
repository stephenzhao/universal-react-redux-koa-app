global.__IS_SERVER__ = true;
global.__IS_CLIENT__ = false;

import koa        from 'koa';
import KoaRouter  from 'koa-router';
import ssr        from './ssr';
import favicon    from 'koa-favicon';
import path       from 'path';

var app     = koa();
var router  = KoaRouter();

router.get('/', function * (next){
    yield next;
});

app
    .use(favicon(path.resolve('favicon.ico')))
    .use(function * (next){
        this.initialData = {};
        yield next;
    })
    .use(ssr)
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000, function () {
    console.log('3000 is listening!');
});