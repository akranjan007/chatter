import toast from "react-hot-toast"
import { setLoading, setToken } from "../../Slice/authSlice";
import { apiConnector } from "../apiConnector";

import { endpoints } from "../api";
import { setUser } from "../../Slice/profileSlice";
import { jsx } from "react/jsx-runtime";
import { setCurrentUser } from "../../Slice/chatSlice";
const { SIGNUP_API, LOGIN_API, LOGOUT_API, CHECK_API } = endpoints;



export function signup(formData, navigate){
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    return async(dispatch) => {
        const toastId = toast.loading("Loading....");
        dispatch(setLoading(true));
        try{
            //console.log("SIGNUP_API.......... ", SIGNUP_API);
            const response = await apiConnector("POST", SIGNUP_API, {
                firstName, lastName, email, password, confirmPassword
            });
            //console.log("SIGNUP_API RESPONSE..... ", response);
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful!");
            navigate("/login");
        } catch(error){
            console.log("SIGNUP_API ERROR............ ",error);
            toast.error("Signup Failed!");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function login(formData, navigate){
    const {email, password} = formData;
    //const username = email;
    return async(dispatch) => {
        const toastId = toast.loading("Loading.....");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", LOGIN_API, {
                email, password
            });
            console.log("LOGIN_API RESPONSE........ ",  response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            const tok = response.data.token;
            dispatch(setToken(tok));
            toast.success("Login Successful!");
            console.log(response.data.userObj);
            dispatch(setUser(response.data.userObj));
            //console.log("EMAIL TO SET AS CURRENT USER: ", response.data.userObj.email);
            dispatch(setCurrentUser(response.data.userObj.email));
            localStorage.setItem("currentUser", JSON.stringify(response.data.userObj.email));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("userObj", JSON.stringify(response.data.userObj));
            navigate("/chats");
        }catch(error){
            console.log("LOGIN_API ERROR.............. ", error);
            toast.error("Login Failed!");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Processing");
        dispatch(setLoading(true));
        try{
            //backend call for logout
            const response = await apiConnector("POST", LOGOUT_API);
            console.log("LOGOUT_API_RESPONSE.........", response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            dispatch(setToken(null));
            dispatch(setUser(null));
            localStorage.clear();
            navigate("/login");
        }catch(error){
            console.log("LOGOUT_API_ERROR........", error);
            toast.error("Logout Failed");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function tokenCheck(token, shouldRedirect = true) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("POST", CHECK_API, {}, {
        Authorization: `Bearer ${token}`,
      });

      if (response.status === 200) {
        return true;
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Token check failed:", error.message);
      localStorage.clear();
      dispatch(setToken(null));
      dispatch(setUser(null));

      if (shouldRedirect) {
        toast.error("Session Expired. Logging Out...");
      }
      return false;
    }
  };
}
