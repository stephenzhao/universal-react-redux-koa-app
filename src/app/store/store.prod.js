import {createStore, applyMiddleWare} from 'redux'
import thunk from 'redux-thunk'
import api from '../middelware/api'
import rootReducer from '../reducer'

export default function strore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleWare(thunk, api));
}

