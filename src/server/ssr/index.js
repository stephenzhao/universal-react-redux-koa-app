import React from 'react';
import ReactDomServer from 'react-dom/server';
import createHistory from 'history/lib/createMemoryHistory';
import createRoutes from '../../app/route';
import {match, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import fs from 'fs';
import path from 'path';
import store from '../../app/store';
var i = 0;
function serverRender(url, store) {
    var routes = createRoutes(createHistory());
    return new Promise(function (res, rej) {
        match({routes: routes, location: url}, (error, redirectLocation, renderProps) => {
            var html;

            if (error) {
                rej(error);
                return;
            }
            if (redirectLocation) {
                return res({
                    redirect: redirectLocation
                });
            }
            html = ReactDomServer.renderToString(
                <Provider store={store}>
                  <RouterContext {...renderProps} />
                </Provider>
              );
            return res({
                html: html
            });
        });
    });
};

module.exports = function * (next) {
    var ctx = this;
    var html = fs.readFileSync(path.resolve('./src/app/index.html'), 'UTF-8');
    var initialData = this.initialData;
    var _store = store(initialData);
    // console.log('xx--', i++);
    serverRender(this.request.url, _store)
            .then(function (result) {
                if (result.html) {
                    var content = html
                        .replace(/<%= HTML %>/g, result.html)
                        .replace(/<%= __INIT_DATA__ %>/, JSON.stringify(_store.getState()))
                        .replace(/<%= LIBJS %>/, '/lib.js')
                        .replace(/<%= APPJS %>/, '/app.js')
                        .replace(/<%= STYLE %>/, 'http://s1.wm1t.com/party/style/index.css');
                    ctx.body = content + i++;
                }
            })
            .catch(function (err) {
                ctx.body = err.message;
            });
    yield next;
};