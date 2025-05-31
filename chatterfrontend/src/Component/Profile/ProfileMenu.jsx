import { useSelector } from "react-redux";
import Logout from "./Logout";

const ProfileMenu = () => {
    const {user} = useSelector((state)=>state.profile);
    //const userObj = localStorage.getItem("userObj");
    //console.log(user);
    return(
        <div>
            <div>{ user!==null && (user?.firstName +" "+user?.lastName) || "Guest User"}</div>
            <div>{user?.email}</div>
            <div>
                {/*Setting button*/}
            </div>
            <div>
                {/*Logout button*/}
                {
                    user!==null && <Logout/>
                }
            </div>
        </div>
    )
}

export default ProfileMenu;