import { useEffect, useState } from "react";
import ProfileMenu from "../Profile/ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { searchUser } from "../../Services/Operations/chatAPI";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state)=>state.auth.token);
    const {user} = useSelector((state)=>state.profile);
    const [loginState, setLoginState] = useState(false);
    const {
        register, handleSubmit, reset
    } = useForm();
    useEffect(()=>{
        setLoginState(user!==null);
    }, [user]);

    const onSubmit = (data) => {
        const searchUserId = data.searchUser;
        dispatch(searchUser(searchUserId, token , navigate));
    }
    return (
        <div class="nav">
            <Link to={"/"}><p>Chatter</p></Link>
            <Link to={"/chats"}><p>Chats</p></Link>
            {
                loginState && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="Search User"
                            {...register("searchUser", {require:true})}
                            className="typingBox"
                        />
                        <button type="submit"><FaSearch/></button>
                    </form>
                )
            }            {
                loginState ? (<ProfileMenu/>) :
                (<Link to={"/login"}><p className="loginButton">Login</p></Link>)
            }
        </div>
    )
}

export default Navbar;