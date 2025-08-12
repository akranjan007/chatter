import React, { useMemo, useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
//import { useWebSocket } from "../../Context/WebSocket/WebSocketProvider";
import { useWebSocket } from "../../Context/WebSocket/WebSocketProvider_v2";
import { addMessageToChat } from "../../Slice/chatSlice";
import { fetchProfile } from "../../Services/Operations/chatAPI";
import { addConnections } from "../../Slice/profileSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { currentUser, chatUser, chats } = useSelector((state) => state.chat);
  const { connections } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  //const token = localStorage.getItem("token");
  const { socket, isConnected, concurrentSessions } = useWebSocket();
  const endOfChatRef = useRef(null);
  //const status = "ONline";
  
  //console.log("session print", concurrentSessions);
  const currentUserRef = useRef(currentUser);
  const connectionsRef = useRef(connections);
  const chatUserRef = useRef(chatUser);

  
  useEffect(() => {
    currentUserRef.current = currentUser;
    connectionsRef.current = connections;
    chatUserRef.current = chatUser;
  }, [currentUser, connections, chatUser]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (event) => {
      try {
        const messageObj = JSON.parse(event.data);
        const chatKey = messageObj.senderId === currentUserRef.current 
          ? messageObj.receiverId 
          : messageObj.senderId;

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
        console.error("Failed to parse message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, dispatch, token]);

  const currentChatHistory = useMemo(() => {
    if (!chatUser?.email || !chats) return [];
    return chats[chatUser.email] || [];
  }, [chatUser, chats]);

  useEffect(() => {
    if(endOfChatRef.current){
      endOfChatRef.current.scrollIntoView({behavior:"smooth"});
    }
  }, [currentChatHistory]);

  const { register, handleSubmit, reset } = useForm();

  if (!chatUser || !chatUser.email) {
    return <div id="chatArea">Select a chat.</div>;
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

    dispatch(addConnections({
      email: chatUser.email,
      firstName: chatUser.firstName || "",
      lastName: chatUser.lastName || "",
      userId: chatUser.userId || "",
      userName: chatUser.userName || "",
    }));

    if (isConnected) {
      socket.send(JSON.stringify({
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
      <div id="chatUserHeader">
        <p id="name">{chatUser.firstName}   {chatUser.lastName}</p>
        <p id="status">
          {chatUser?.email === currentUser
            ? "Online"
            : (Array.isArray(concurrentSessions) && concurrentSessions.includes(chatUser?.email)
                ? "Online"
                : "")
          }
        </p>
      </div>
      <div id="chatDisplayArea">
        {currentChatHistory.map((message, index) => {
          const messageSide = currentUser!==message.senderId ? "left" : "right";
          return (
          <div key={index} className={`message ${messageSide}`}>
            <p className="message-sender">
              {currentUser !== message.senderId ? `${chatUser.firstName} ${chatUser.lastName}` : "You"}
            </p>
            <p className="message-text">{message.message}</p>
            <p className="message-time">
              {message.timestamp.toString().substring(0, 10) + ' ' + message.timestamp.toString().substring(11, 16)}
            </p>
          </div>
          );
        })}
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