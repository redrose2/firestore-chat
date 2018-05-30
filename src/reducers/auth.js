import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    user: null,
    loginInfo: null
});

const setUser = (state, action) => ({
    ...state,
    user: action.payload
});

const logout = (state, action) => ({
    user: null,
});

const actionHandlers = {
    [Types.SET_USER]: setUser,
    [Types.LOGOUT]: logout,
};

export default createReducer(initialState, actionHandlers);