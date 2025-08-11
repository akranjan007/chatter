import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")): null,
    chats:{},
    chatUser:null,
    status: localStorage.getItem("status") ? JSON.parse(localStorage.getItem("status")) : null,
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
        addMessageToChat: (state, action) => {
            const { senderEmail, receiverEmail, message, timestamp } = action.payload;
            const chatKey = senderEmail === state.currentUser
                ? receiverEmail
                : senderEmail;

            if (!state.chats[chatKey]) {
                state.chats[chatKey] = [];
            }

            state.chats[chatKey].push({
                message,
                senderId: senderEmail,
                receiverId: receiverEmail,
                timestamp: timestamp || new Date().toISOString()
            });
        },
        setChatUser(state, value){
            state.chatUser = value.payload;
        },
        setStatus(state, value){
            state.status = value.payload;
        },
    }
});

export const { setCurrentUser, setChats, setChatUser, addMessageToChat, setStatus} = chatSlice.actions;
export default chatSlice.reducer;