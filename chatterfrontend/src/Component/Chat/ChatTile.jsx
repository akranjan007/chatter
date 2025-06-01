import react from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchChat } from "../../Services/Operations/chatAPI";

const ChatTile = ({connection}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const senderEmail = useSelector((state)=>state.profile.user.email);
    const token = useSelector((state)=>state.auth.token);
    const receiverEmail = connection.email;
    function openChatHandler(){
        dispatch(fetchChat(senderEmail, receiverEmail, token, navigate));
    }
    return (
        <div id="chatTile" onClick={openChatHandler}>
            <p>{connection?.firstName + " " + connection?.lastName + " (" + connection?.userName + ")"}</p>
        </div>
    )
};

export default ChatTile;
