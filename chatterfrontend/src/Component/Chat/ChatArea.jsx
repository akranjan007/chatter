import React, { useMemo, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessageToChat } from "../../Slice/chatSlice";

const ChatArea = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser, chatUser, chats} = useSelector((state)=>state.chat);
    const {token} = useSelector((state)=>state.auth);
    const {
        register,
        handleSubmit,
        reset
    } = useForm();
    const [message, setMessage] = useState([]);
    
    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);

        socket.current.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.current.onmessage = (event) => {
            //console.log("WS Message:", typeof event.data);  // <== LOOK HERE
            try {
                const messageObj = JSON.parse(event.data);
                console.log("Message Object.... ", messageObj);
                dispatch(addMessageToChat({
                    senderEmail: messageObj.senderId,
                    receiverEmail: messageObj.receiverId,
                    message: messageObj.messageText,
                    timestamp: messageObj.timestamp
                }));
            } catch (err) {
                console.error("Failed to parse message:", err);
            }
        };


        socket.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => socket.current.close();
    }, [token, chatUser]);

    const currentChatHistory = useMemo(() => {
        if (!chatUser || !chatUser.email || !chats) return [];
        return chats[chatUser.email] || [];
    }, [chatUser, chats]);

    if(!chatUser || !chatUser.email ){
        return (<div>Select a chat.</div>)
    }

    
    const onSubmit = (data) => {
        if (!data.message.trim()) return;
        console.log(data.message);
        const message = data.message;
        dispatch(addMessageToChat({
                    senderEmail: currentUser,
                    receiverEmail: chatUser.email,
                    message: message,
                    timestamp: new Date().toLocalString,
                }));
        socket.current.send(JSON.stringify({
            receiverId:chatUser.email,
            messageText:message
        }));
        //setInput("");
        reset();
    };
    //console.log("chat ", currentChatHistory);
    //console.log(currentUser);
    return (
        <div id="chatArea">
            <div id="chatDisplayArea">
                {
                currentChatHistory!==null && currentChatHistory?.map((message, index)=>(
                    <div key={index} className="message">
                            <p className="message-sender">
                            {currentUser !== message.senderId ? `${message.senderId}` : "You"}
                            </p>
                        <p className="message-text">{message.message}</p>
                        <p className="message-time">{message.timestamp.toString().substring(0, 10) +' '+message.timestamp.toString().substring(11, 16)}</p>
                    </div>

                ))
            }
            </div>
            <form onSubmit={handleSubmit(onSubmit)} id="typingArea">
                <input
                    type="text"
                    placeholder="Type your message"
                    {...register("message", {required:true})}
                    className="typingBox"
                />
                <button type="submit" id="sendButton"><BsSend /></button>
            </form>
        </div>
    )
};

export default ChatArea;