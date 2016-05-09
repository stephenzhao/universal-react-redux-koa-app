global.__IS_SERVER__ = true;
global.__IS_CLIENT__ = false;

import koa        from 'koa';
import KoaRouter  from 'koa-router';
import ssr        from './ssr';
import favicon    from 'koa-favicon';
import path       from 'path';
// import Static     from './middleware/static';
import staticServer from 'koa-static';


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
    .use(router.routes())
    .use(staticServer('build'))
    .use(ssr);
// 静态资源托管


app.listen(3001, function () {
    console.log('3001 is listening!');
});