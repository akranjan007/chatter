import react, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConnections, fetchAllChat } from "../Services/Operations/chatAPI";
import ChatTile from "../Component/Chat/ChatTile";
import ChatArea from "../Component/Chat/ChatArea";

const Chats = () => {
    const {user, connections} = useSelector((state)=>state.profile);
    const {chats} = useSelector((state)=>state.chat);
    const { token } = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //console.log(connections);
    useEffect(()=>{
        if(user && user.email){
            dispatch(fetchConnections(user.email, token, navigate));
            dispatch(fetchAllChat(user.email, token, navigate));
        }
    }, [user]);
    return (
        <div id="chat">
            <div id="chatTileMaster">
                {
                    connections.map((connection, index) => (
                        <ChatTile key={index} connection={connection} chat={chats[connection.email]}/>
                    ))
                }
            </div>
            <ChatArea/>
        </div>
    )
};

export default Chats;