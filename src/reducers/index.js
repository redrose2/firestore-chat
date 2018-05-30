import { combineReducers } from 'redux';

import global from './global';
import auth from './auth';

export default combineReducers({
    auth,
    global,
});