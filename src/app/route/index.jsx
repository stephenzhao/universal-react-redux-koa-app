// redux router
//  接收 history参数 生成路由
import React from 'react';
import {Router, Route} from 'react-router';
import App from '../container/App';
import X from '../component/X';

export default history =>(
        <Router history={history}>
            <Route path='/' component={App}></Route>
            <Route path='/x' component={X}></Route>
        </Router>
    );