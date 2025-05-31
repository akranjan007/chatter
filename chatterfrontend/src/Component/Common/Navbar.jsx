import { useEffect, useState } from "react";
import ProfileMenu from "../Profile/ProfileMenu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
    const {user} = useSelector((state)=>state.profile);
    const [loginState, setLoginState] = useState(false);
    
    useEffect(()=>{
        setLoginState(user!==null);
    }, [user]);

    return (
        <div class="nav">
            <Link to={"/"}><p>Chatter</p></Link>
            <Link to={"/chats"}><p>Chats</p></Link>
            {
                loginState ? (<ProfileMenu/>) :
                (<Link to={"/login"}><p className="loginButton">Login</p></Link>)
            }
        </div>
    )
}

export default Navbar;