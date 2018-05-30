import Types from './actionTypes';

export const setUser = (user) => ({
    type: Types.SET_USER,
    payload: user
});

export const logout = () => ({
    type: Types.LOGOUT
});