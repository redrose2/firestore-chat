import Types from './actionTypes';

export const setRoomList = ((roomList) => ({
    type: Types.SET_ROOM_LIST,
    payload: roomList,
}));

export const setMessages = ((messages) => ({
    type: Types.SET_MESSAGES,
    payload: messages,
}));