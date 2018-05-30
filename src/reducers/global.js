import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    roomList: [],
    messages: [],
});

const setRoomList = (state, action) => ({
    ...state,
    roomList: action.payload.roomList,
});

const setMessages = (state, action) => ({
    ...state,
    messages: action.payload.messages,
});

const actionHandlers = {
    [Types.SET_ROOM_LIST]: setRoomList,
    [Types.SET_MESSAGES]: setMessages,
};

export default createReducer(initialState, actionHandlers);