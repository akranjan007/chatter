import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../Slice/authSlice';
import profileReducer from '../Slice/profileSlice';
import chatReducer from '../Slice/chatSlice';

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    chat:chatReducer,
})

export default rootReducer;