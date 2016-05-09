// client

import React from 'react';
import ReactDom from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import store from './store';
import routes from './route';
import * as util from './util';
import '../static/style/index.css';

if (util.isAndroid()) {
    document.body.classList.add('android');
}

if (util.isIOS()) {
    document.body.classList.add('ios');
}
var _store = store(window.__INIT_DATA__);
ReactDom.render(
    <Provider store={_store}>
        <Router history={ browserHistory } routes={routes(browserHistory)} />
    </Provider>,
    document.getElementById('app')
);