import react from "react";
import { useSelector } from "react-redux";

const Chats = () => {
    const {user} = useSelector((state)=>state.profile);

    return (
        <div id="chat">
            <p>{user?.email}</p>
        </div>
    )
};

export default Chats;