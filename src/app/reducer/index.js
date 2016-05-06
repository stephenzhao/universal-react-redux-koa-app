import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import app from './app';

export default combineReducers({
  routing,
  app
});
