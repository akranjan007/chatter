import { setLoading } from "../../Slice/authSlice";
import { apiConnector } from "../apiConnector";
import {endpoints} from "../api";
import { setConnections } from "../../Slice/profileSlice";
import toast from "react-hot-toast";
import { setChats } from "../../Slice/chatSlice";
const { CONNECTIONS_API, CHAT_API_ALL } = endpoints;

export function fetchConnections(email, token, navigate){
    const senderEmail = email;
    return async(dispatch) => {
        const toastId = toast.loading("Loading....");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", CONNECTIONS_API, {senderEmail}, {
                Authorization: `Bearer ${token}`
            });
            //console.log("CONNECTIONS_API RESPONSE........... ", response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            dispatch(setConnections(response.data.data));
            localStorage.setItem("connections", JSON.stringify(response.data.data));
            //toast.success("Chats Fetched");
        } catch(error){
            console.log("CONNECTIONS_API ERROR.......... ", error.message);
            toast.error("Chats Error");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function fetchAllChat(senderEmail, token, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading......");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", CHAT_API_ALL, { senderEmail }, {
                Authorization: `Bearer ${token}`
            });
            console.log("CHAT_API_ALL RESPONSE.......... ", response);
            if(!response.data.success) throw new Error(response.data.message);
            dispatch(setChats(response.data.data));

        }catch(error){
            console.log("CHAT_API_ALL ERROR.........", error.message);
            toast.error("Error while fetching Chat")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}