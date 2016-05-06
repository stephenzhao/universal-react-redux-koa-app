import {applyMiddleware, createStore as _createStore} from 'redux';
import logger from '../middleware/logger';
import rootReducer from '../reducer';
const hasReduxTool = () => {
    return process.browser && window.DEV !== 'production' && window.devToolsExtension;
};

export default (initialState) => {

    const cs = hasReduxTool() ? window.devToolsExtension()(_createStore): _createStore;
    const createStore = applyMiddleware(...logger)(cs);
    const store = createStore(rootReducer, initialState);
    module.hot && module.hot.accept('../reducer', function () {
        store.replaceReducer(require('../reducer'));
    });

    return store;
};

