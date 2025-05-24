import { useSelector } from "react-redux";

const ProfileMenu = () => {
    const {user} = useSelector((state)=>state.profile);
    const userObj = localStorage.getItem("user");

    return(
        <div>
            <div>{userObj?.firstName +" "+userObj?.lastName || "Guest User"}</div>
            <div>{userObj?.email || "No Email Updated."}</div>
            <div>
                {/*Setting button*/}
            </div>
            <div>
                {/*Logout button*/}
                
            </div>
        </div>
    )
}

export default ProfileMenu;