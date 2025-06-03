import react from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatTile = ({connection, chat}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const senderEmail = useSelector((state)=>state.profile.user.email);
    const token = useSelector((state)=>state.auth.token);
    //console.log(chat[chat.length - 1].message);
    function openChatHandler(){
        
    }
    return (
        <div id="chatTile" onClick={openChatHandler}>
            <p>{connection?.firstName + " " + connection?.lastName + " (" + connection?.userName + ")"}</p>
            {/*
            {
                chat && chat.length > 0 && (<p>{chat[chat.length - 1].message}</p>)
            }
            */}
        </div>
    )
};

export default ChatTile;
