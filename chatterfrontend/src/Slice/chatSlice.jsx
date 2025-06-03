import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")): null,
    chats:{},
    chatUser:null
}

const chatSlice = createSlice({
    name:"chat",
    initialState:initialState,
    reducers:{
        setCurrentUser(state, value){
            state.currentUser = value.payload;
        },
        setChats(state, value){
            state.chats = value.payload;
        },
        addNewMessage(state, value){
            const { receiverId, message } = value.payload;
            if(!state.chats[receiverId]){
                state.chats[receiverId] = [];
            }
            state.chats[receiverId].push(message);
        },
        setChatUser(state, value){
            state.chatUser = value.payload;
        },
    }
});

export const { setCurrentUser, setChats, addNewMessage, setChatUser } = chatSlice.actions;
export default chatSlice.reducer;