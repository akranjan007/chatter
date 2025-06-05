import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    if(!chatUser || !chatUser.email || !chats || !chats[chatUser.email]){
        return (<div>Select a chat.</div>)
    }
    const currentChatHistory = chats[chatUser.email];
    const onSubmit = (data) => {
        if (!data.message.trim()) return;
        console.log(data.message);
        const message = data.message;
        socket.current.send(JSON.stringify({
            receiverId:chatUser.email,
            messageText:message,
        }));
        setInput("");
        reset();
    };

    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);

        socket.current.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Message received : ", message);
            setMessages((prev) => [...prev, message]);
        };

        socket.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => socket.current.close();
    }, [token]);

    

    //console.log(currentUser);
    return (
        <div id="chatArea">
            <div id="chatDisplayArea">
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