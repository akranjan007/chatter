import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../Slice/authSlice';
import profileReducer from '../Slice/profileSlice';

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
})

export default rootReducer;