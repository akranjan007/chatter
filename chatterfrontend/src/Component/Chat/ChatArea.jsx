import React, { useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessageToChat } from "../../Slice/chatSlice";
import { fetchProfile } from "../../Services/Operations/chatAPI";
import { addConnections } from "../../Slice/profileSlice";

const ChatArea = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser, chatUser, chats } = useSelector((state) => state.chat);
    const { connections } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);

    // 🔧 Track WebSocket connection
    const socket = useRef(null);

    // 🔧 Track current user and connection values to avoid stale closures
    const userRef = useRef(currentUser);
    const connectionsRef = useRef(connections);
    const endOfChatRef = useRef(null);
    

    // ✅ Keep refs updated with latest values
    useEffect(() => {
        userRef.current = currentUser;
    }, [currentUser]);

    useEffect(() => {
        connectionsRef.current = connections;
    }, [connections]);

    // ✅ Establish WebSocket connection once (unless token changes)
    useEffect(() => {
        if (!token) return;

        const createSocket = () => {
            socket.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);

            socket.current.onopen = () => {
                console.log("✅ WebSocket connected");
            };

            socket.current.onmessage = (event) => {
                // ✅ Async handler to avoid unhandled promise issues
                const handleMessage = async () => {
                    try {
                        const messageObj = JSON.parse(event.data);
                        const chatKey = messageObj.senderId === userRef.current ? messageObj.receiverId : messageObj.senderId;

                        // ✅ Add connection only if it doesn't exist
                        const exists = connectionsRef.current.some(conn => conn.email === chatKey);
                        if (!exists) {
                            const response = await dispatch(fetchProfile(chatKey, token));
                            dispatch(addConnections({
                                email: chatKey,
                                firstName: response.firstName || "",
                                lastName: response.lastName || "",
                                userId: response.userId || "",
                                userName: response.userName || "",
                            }));
                        }

                        dispatch(addMessageToChat({
                            senderEmail: messageObj.senderId,
                            receiverEmail: messageObj.receiverId,
                            message: messageObj.messageText,
                            timestamp: messageObj.timestamp
                        }));
                    } catch (err) {
                        console.error("❌ Failed to parse message:", err);
                    }
                };

                handleMessage();
            };

            // ✅ Reconnect logic if socket is closed
            socket.current.onclose = () => {
                console.log("⚠️ WebSocket disconnected. Retrying...");
                setTimeout(() => createSocket(), 2000); // Reconnect after 2 seconds
            };
        };

        createSocket(); // First-time connection

        return () => {
            socket.current?.close();
        };
    }, [token]); // Only depends on token

    // ✅ Filter messages for current chat user
    const currentChatHistory = useMemo(() => {
        if (!chatUser || !chatUser.email || !chats) return [];
        return chats[chatUser.email] || [];
    }, [chatUser, chats]);
    useEffect(()=>{
        if(endOfChatRef.current){
            endOfChatRef.current.scrollIntoView({behavior:"smooth"});
        }
    }, [currentChatHistory]);

    const { register, handleSubmit, reset } = useForm();

    if (!chatUser || !chatUser.email) {
        return <div>Select a chat.</div>;
    }

    // ✅ Send message
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

        dispatch(addConnections({
            email: chatUser.email,
            firstName: chatUser.firstName || "",
            lastName: chatUser.lastName || "",
            userId: chatUser.userId || "",
            userName: chatUser.userName || "",
        }));

        // ✅ Only send if socket is open
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                receiverId: chatUser.email,
                messageText: message
            }));
        } else {
            console.warn("WebSocket not ready. Message not sent.");
        }

        reset();
    };

    return (
        <div id="chatArea">
            <div id="chatDisplayArea">
                {
                    currentChatHistory.map((message, index) => (
                        <div key={index} className="message">
                            <p className="message-sender">
                                {currentUser !== message.senderId ? `${message.senderId}` : "You"}
                            </p>
                            <p className="message-text">{message.message}</p>
                            <p className="message-time">
                                {message.timestamp.toString().substring(0, 10) + ' ' + message.timestamp.toString().substring(11, 16)}
                            </p>
                        </div>
                    ))
                }
                <div ref={endOfChatRef}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} id="typingArea">
                <input
                    type="text"
                    placeholder="Type your message"
                    {...register("message", { required: true })}
                    className="typingBox"
                />
                <button type="submit" id="sendButton"><BsSend /></button>
            </form>
        </div>
    );
};

export default ChatArea;