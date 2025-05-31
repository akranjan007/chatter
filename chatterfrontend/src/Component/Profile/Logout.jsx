import react from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Services/Operations/authAPI";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout(navigate));
    }

    return (
        <div>
            <button onClick={logoutHandler} id="logoutButton">Logout</button>
        </div>
    )
};

export default Logout;