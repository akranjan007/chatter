import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : localStorage.getItem("userObj") ? JSON.parse(localStorage.getItem("userObj")) : null,
    loading : false,  
    connections : [],
};

const profileSlice = createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state, value){
            state.user = value.payload;
        },
        setLoading(state, value){
            state.loading = value.payload;
        },
        setConnections(state, value){
            state.connections = value.payload;
        },
        addConnections: (state, action) => {
            const exists = state.connections.some(conn => conn.email === action.payload.email);
            if (!exists) {
                state.connections.push(action.payload);
            }
        }

    }
});

export const {setUser, setLoading, setConnections, addConnections} = profileSlice.actions;
export default profileSlice.reducer;