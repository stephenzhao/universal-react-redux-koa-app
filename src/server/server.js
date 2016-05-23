global.__IS_SERVER__ = true;
global.__IS_CLIENT__ = false;

import koa        from 'koa';
import KoaRouter  from 'koa-router';
import ssr        from './ssr';
import favicon    from 'koa-favicon';
import path       from 'path';
import fs         from 'fs';
import logger     from 'koa-logger';
// import Static     from './middleware/static';
// import staticServer from 'koa-static';


var app     = koa();
var router  = KoaRouter();
var extname = path.extname;

router.get('/', function * (next){
    yield next;
});

app
    .use(logger())
    .use(favicon(path.resolve('favicon.ico')))
    .use(function * (next){
        this.initialData = {};
        yield next;
    })
    .use(router.routes())
    .use(ssr)
    .use(function * (next){
        var _path =  path.join(__dirname,'../../', this.path);
        if (!this.path.match(/^\/build\//)) {
            yield* next
            return
        }
        var fstat = yield function (done) {
            fs.stat(_path, done)
        };
        if (fstat.isFile()) {
            this.type = extname(_path);
            this.body = fs.createReadStream(_path);
        }
    });
// app.use(Static({
//     staticOpts: {
//       router: '/build',               //路由映射
//       dir: path.join(__dirname,'../../build'),    // 托管的目录
//       maxage: 1000 * 3600 * 24          //设置 maxage，默认缓存一天
//     },
//     app: app
// }));
app.on('error', function(err,ctx){
    console.log(err);
});

app.listen(3001, function () {
    console.log('3001 is listening!');
});