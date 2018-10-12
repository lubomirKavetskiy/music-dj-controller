import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tracks from './uploadPageReducer';
import players from './djControllerPageReducer';

export default combineReducers({
  router: routerReducer,
  tracks,
  players,
});
