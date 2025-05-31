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
        <div >
            <p>Chatter</p>
            <p>Chats</p>
            {
                loginState ? (<ProfileMenu/>) :
                (<Link to={"/login"}><p>Login</p></Link>)
            }
        </div>
    )
}

export default Navbar;