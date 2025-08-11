import react, { useContext, useEffect, useRef, useState, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tokenCheck } from "../../Services/Operations/authAPI";
import { useNavigate } from "react-router-dom";
import { useOnlineStatus } from "../../Utils/CustomHooks/UserStatusHook";
import { fetchConcurrent } from "../../Services/Operations/chatAPI";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const reconnectTimeRef = useRef(null);
  const initialConnectionMade = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const closeConnection = (code, reason) => {
    if (socketRef.current) {
      //remove all event listeners
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;

      //close existing connection
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close("1000", "Normal Closure");
      }
      socketRef.current = null;
    }
    //clear any pending reconnection attempt
    if (reconnectTimeRef.current) {
      clearTimeout(reconnectTimeRef.current);
      reconnectTimeRef.current = null;
    }
    //reset all connection state
    initialConnectionMade.current = false;
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  };

  const connectWebSocket = async (forceReconnect=false) => {
    if (initialConnectionMade.current && !forceReconnect) {
      return;
    }
    //validate token
    try {
      const isValid = await dispatch(tokenCheck(token));
      if (!isValid) {
        closeConnection();
        navigate("/login");
        return;
      }
    } catch (error) {
      closeConnection();
      navigate("/login");
      return;
    }
    //create new connection
    socketRef.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);
    socketRef.current.onopen = () => {
        console.log("WebSocket Connected!");
        initialConnectionMade.current = true;
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
    };
    socketRef.current.onclose = async (event) => {
        console.log("WebSocket Disconnected!", event);
        setIsConnected(false);
        //reconnection attempt
        try{
            const isStillValid = await dispatch(tokenCheck(token));
            if(!isStillValid){
                closeConnection();
                navigate("/login");
                return;
            }
            //reconnect
            reconnectAttemptsRef.current += 1;
            const delay = Math.min(1000*Math.pow(2, Math.floor(reconnectAttemptsRef.current/2)), 3000);
            reconnectTimeRef.current = setTimeout(() => connectWebSocket(true), delay);
        } catch(error) {
            closeConnection();
            navigate("/login");
        }
    };
    socketRef.current.onerror = (error) => {
        console.log("WebSocket Error: ", error);
        closeConnection(1005, "Connection Error");
    };
  };

  useEffect(() => {
    if (token) {
        connectWebSocket();
    } else {
      closeConnection();
    }

    return () => {
        if(reconnectTimeRef.current){
            clearTimeout(reconnectTimeRef.current);
            reconnectTimeRef.current = null;
            //reconnectAttemptsRef.current = 0;
        }
    };
  }, [token, dispatch, navigate]);

  const {onlineUser, error} = useOnlineStatus(token);
  /*useEffect(() => {
  if (onlineUser) {
    console.log("Concurrent session map:", onlineUser);
  }
}, [onlineUser]);*/

  //pass context values and state
  const value = {
    socket : socketRef.current,
    isConnected,
    sendMessage : (message) => {
        if(socketRef.current?.readyState === WebSocket.OPEN){
            socketRef.current.send(JSON.stringify(message));
        }
        else{
            console.warn("Cannot send messsage - WebSocket Not Connected");
        }
    },
    reconnect : () => connectWebSocket(true),
    closeConnection,
    concurrentSessions : onlineUser
  };

  return (
    <WebSocketContext.Provider value={value}>
        {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if(!context){
        throw new Error("useWebSocket must be in WebSocketContext");
    }
    return context;
};
