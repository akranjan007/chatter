import react from "react";
import { useSelector } from "react-redux";

const ChatArea = () => {
    const {currentUser, chatUser, chats} = useSelector((state)=>state.chat);
    if(!chatUser || !chatUser.email || !chats || !chats[chatUser.email]){
        return (<div>Select a chat.</div>)
    }

    const currentChatHistory = chats[chatUser.email];
    //console.log(currentUser);
    return (
        <div id="chatArea">
            {
                currentChatHistory!==null && currentChatHistory?.map((message, index)=>(
                    <div key={index}>
                    <span>{currentUser!==message.senderId ? ( message.senderId + ": ") : ("You: ")}</span>
                    <span>{message.message}</span>
                    <br/>
                    </div>
                ))
            }
        </div>
    )
};

export default ChatArea;