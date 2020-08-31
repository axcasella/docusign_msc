import { combineReducers } from 'redux';
import { reducer as certificationReducer } from './certification';

export default combineReducers({
  cert: certificationReducer,
});
