import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const OpenRoute = ({children}) => {
    const token = useSelector((state)=>state.auth.token);
    if(token===null) return children;
    else{
        return <Navigate to="/chats"/>
    }
};

export default OpenRoute;

