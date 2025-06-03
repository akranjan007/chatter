import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    chats:{}
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
    }
});

export const { setCurrentUser, setChats, addNewMessage } = chatSlice.actions;
export default chatSlice.reducer;