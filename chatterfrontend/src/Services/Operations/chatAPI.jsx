import { setLoading } from "../../Slice/authSlice";
import { apiConnector } from "../apiConnector";
import {endpoints} from "../api";
import { setConnections } from "../../Slice/profileSlice";
import toast from "react-hot-toast";
import { setChats, setChatUser, setStatus } from "../../Slice/chatSlice";
const { CONNECTIONS_API, CHAT_API_ALL, SEARCH_USER_API, USER_PROFILE_API, STATUS_CHECK_API, CONCURRENT_CHECK_API } = endpoints;

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

export function searchUser(searchUser, token, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("POST", SEARCH_USER_API, {searchUser}, {Authorization: `Bearer ${token}`});
            console.log("SEARCH_USER_API......... ", response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            dispatch(setChatUser(response.data.data));
        } catch(error) {
            console.log("SEARCH_USER_API ERROR....... ", error.message);
            toast.error("User Not Found / Error while searching");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function fetchProfile(emailId, token) {
    return async () => {
        try {
            const response = await apiConnector(
                "POST",
                SEARCH_USER_API,
                { searchUser: emailId },
                { Authorization: `Bearer ${token}` }
            );
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            return response.data.data;
        } catch (error) {
            console.error("SEARCH_USER_API (PROFILE) ERROR:", error.message);
            return null;
        }
    };
}

export function checkStatus(token, emailId, dispatch){
    return async () => {
        try{
            const response = await apiConnector(
                "POST",
                STATUS_CHECK_API,
                { checkUser : emailId },
                { Authorization: `Bearer ${token}`}
            );
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            //localStorage.setItem("status", JSON.stringify(response.data.status));
            dispatch(setStatus(response.data.status));
            return response.data.status;
        } catch(error) {
            console.error("STATUS_CHECK_API ERROR: ", error.message);
            return null;
        }
    }
}

export async function fetchConcurrent(token){
    return async () => {
        try{
            //const response = await apiConnector(
            //    "POST", CONCURRENT_CHECK_API, { checkUser : emailId }, { Authorization: `Bearer ${token}` }
            //);
            const response = await apiConnector("POST", CONCURRENT_CHECK_API, {}, {
                Authorization: `Bearer ${token}`,
            });
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            return response.data.data;
        } catch(error){
            console.error("CONCURRENT_CHECK_API ............. ", error.message);
            return null;
        }
    }
}