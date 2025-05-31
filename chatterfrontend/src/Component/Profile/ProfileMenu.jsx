import { useSelector } from "react-redux";
import Logout from "./Logout";
import { IoIosArrowDropdown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";

const ProfileMenu = () => {
    const {user} = useSelector((state)=>state.profile);
    const [expandProfile, setExpandProfile] = useState(false);
    const dropListRef = useRef(null);
    const handleClickOutside = (event) => {
        if(dropListRef.current && !dropListRef.current.contains(event.target)){
            setExpandProfile(false);
        }
    };

    useEffect(()=>{
        if(expandProfile){
            document.addEventListener("mousedown", handleClickOutside);
        }else{
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [expandProfile]);
    
    return(
        <div ref={dropListRef} id="profileDiv">
            <div id="profilemenu" onClick={()=>{setExpandProfile(!expandProfile)}} >
                <p>{user?.firstName +" "+user?.lastName}</p>
                <p><IoIosArrowDropdown/></p>
            </div>
            {
                expandProfile &&
                <div id="dropdown">
                    <p>Settings</p>
                    <Logout/>
                </div>
            }
        </div>
    )
}

export default ProfileMenu;