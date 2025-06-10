import React, { useMemo, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessageToChat } from "../../Slice/chatSlice";
import { fetchConnections } from "../../Services/Operations/chatAPI";
import { addConnections } from "../../Slice/profileSlice";

const ChatArea = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser, chatUser, chats} = useSelector((state)=>state.chat);
    const { connections } = useSelector((state) => state.profile);
    const {token} = useSelector((state)=>state.auth);
    
    const socket = useRef(null);
    const connectionsRef = useRef(connections);
    useEffect(()=>{
        connectionsRef.current = connections;
    }, [connections])

    useEffect(() => {
        socket.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);

        socket.current.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.current.onmessage = (event) => {
            try {
                const messageObj = JSON.parse(event.data);
                const chatKey = messageObj.senderId === currentUser ? messageObj.receiverId : messageObj.senderId;

                // Add connection only if it's not already in list
                const exists = connectionsRef.current.some((conn) => conn.email === chatKey);

                if (!exists) {
                    dispatch(addConnections({
                        email: chatKey
                    }));
                }

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
    }, [token]); // ❗ remove chatUser dependency


    const currentChatHistory = useMemo(() => {
        if (!chatUser || !chatUser.email || !chats) return [];
        return chats[chatUser.email] || [];
    }, [chatUser, chats]);

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    if(!chatUser || !chatUser.email ){
        return (<div>Select a chat.</div>)
    }
    
    const onSubmit = (data) => {
        if (!data.message.trim()) return;
        const message = data.message;
        const now = new Date();
        const offsetMs = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + offsetMs);
        const currTime = istDate.toISOString();

        dispatch(addMessageToChat({
            senderEmail: currentUser,
            receiverEmail: chatUser.email,
            message,
            timestamp: currTime
        }));

        // Add receiver to connection list if not already present
        dispatch(addConnections({
            email: chatUser.email,
            firstName: chatUser.firstName || "",
            lastName: chatUser.lastName || "",
            userId: chatUser.userId || "",
            userName: chatUser.userName || "",
        }));

        socket.current.send(JSON.stringify({
            receiverId: chatUser.email,
            messageText: message
        }));

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