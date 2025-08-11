import react, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChatUser } from "../../Slice/chatSlice";
import { checkStatus } from "../../Services/Operations/chatAPI";
import { useOnlineStatus } from "../../Utils/CustomHooks/UserStatusHook";
import { useWebSocket } from "../../Context/WebSocket/WebSocketProvider_v2";

const ChatTile = ({connection, chat}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const senderEmail = useSelector((state)=>state.profile.user.email);
    const {currentUser, chatUser} = useSelector((state)=>state.chat);
    const token = useSelector((state)=>state.auth.token);
    //console.log(chat[chat.length - 1].message);
    
    function openChatHandler(){
        //dispatch(checkStatus(token, chatUser.email, dispatch));
        dispatch(setChatUser(connection));
        
    }
    //console.log("debug.", chat);
    return (
        <div id="chatTile" onClick={openChatHandler}>
            <p id="userID">{connection?.firstName + " " + connection?.lastName + " (" + connection?.userName + ")"}</p>
            {
                chat && chat.length > 0 && (
                    <div>
                        <p id="nameID">{
                            chat[chat.length -1].senderId === currentUser ? (<>You : </>) : (<>Received : </>)
                        }
                        
                        {chat[chat.length - 1].message.length > 20 
                                                                ? chat[chat.length - 1].message.substring(0, 20) + '...'
                                                                : chat[chat.length - 1].message}</p>
                        <p id="dateID">{chat[chat.length - 1].timestamp.toString().substring(0, 10) +' '+chat[chat.length - 1].timestamp.toString().substring(11, 16)}</p>
                    </div>   
                    
                )
            }
            
        </div>
    )
};

export default ChatTile;
