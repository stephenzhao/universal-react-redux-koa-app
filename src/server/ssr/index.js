import React from 'react';
import ReactDomServer from 'react-dom/server';
import createHistory from 'history/lib/createMemoryHistory';
import createRoutes from '../../app/route';
import {match, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import fs from 'fs';
import path from 'path';
import store from '../../app/store';
import assetConfig from '../../../build/asset.config.json';
var i = 0;
function serverRender(url, store) {
    var history = createHistory();
    var location = history.createLocation(url)
    var routes = createRoutes(history);
    return new Promise(function (res, rej) {
        match({routes: routes, location: location}, (error, redirectLocation, renderProps) => {
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
            if (!renderProps) {
                rej(error);
                return;
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
    var _store = store(this.initialData);
    serverRender(this.request.url, _store)
            .then(function (result) {
                if (result.html) {

                    var content = html
                        .replace(/<%= HTML %>/g, result.html)
                        .replace(/<%= __INIT_DATA__ %>/, JSON.stringify(_store.getState()))
                        .replace(/<%= LIBJS %>/, '/build/' + assetConfig.lib)
                        .replace(/<%= APPJS %>/, '/build/' + assetConfig.app)
                        .replace(/<%= STYLE %>/, '/build/' + assetConfig.style);
                    ctx.body = content + i++;
                }
            })
            .catch(function (err) {
                ctx.body = err.message;
            });
    yield next;
};