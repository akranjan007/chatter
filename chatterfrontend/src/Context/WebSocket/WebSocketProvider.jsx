import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokenCheck } from "../../Services/Operations/authAPI";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialConnectionMade = useRef(false);
  const messageQueueRef = useRef([]);

  const closeConnection = useCallback((code = 1000, reason = "Normal closure") => {
    if (socketRef.current) {
      // Remove all event listeners first
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      
      // Close the connection
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(code, reason);
      }
      socketRef.current = null;
    }
    
    // Clear any pending reconnection attempts
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    // Reset all connection state
    initialConnectionMade.current = false;
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
    messageQueueRef.current = [];
  }, []);

  const connectWebSocket = useCallback(async (forceReconnect = false) => {
    // Only proceed if we have a valid token
    if (!token) {
      closeConnection();
      return;
    }

    // Clear any existing connection if forcing reconnect
    if (forceReconnect) {
      closeConnection();
    }

    // Skip if already connected and not forcing
    if (initialConnectionMade.current && !forceReconnect) {
      return;
    }

    // Validate token
    try {
      const isValid = await dispatch(tokenCheck(token, false));
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

    // Create new connection
    socketRef.current = new WebSocket(`ws://localhost:8080/api/v1/ws-chat?token=${token}`);

    socketRef.current.onopen = () => {
      console.log("WebSocket Connected");
      initialConnectionMade.current = true;
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;

      // Send any queued messages
      messageQueueRef.current.forEach(msg => {
        socketRef.current.send(JSON.stringify(msg));
      });
      messageQueueRef.current = [];
    };

    socketRef.current.onclose = async (event) => {
      console.log("WebSocket Disconnected", event);
      setIsConnected(false);
      
      try {
        const stillValid = await dispatch(tokenCheck(token, false));
        if (!stillValid) {
          closeConnection();
          navigate("/login");
          return;
        }

        // Reconnect with exponential backoff
        reconnectAttemptsRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, Math.floor(reconnectAttemptsRef.current / 2)), 30000);
        reconnectTimerRef.current = setTimeout(() => connectWebSocket(true), delay);
      } catch (error) {
        closeConnection();
        navigate("/login");
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      closeConnection(1006, "Connection error");
    };
  }, [token, dispatch, navigate, closeConnection]);

  // Effect to handle token changes
  useEffect(() => {
    // Only connect if we have a token
    if (token) {
      connectWebSocket();
    } else {
      closeConnection();
    }

    return () => {
      // Only clean up timers, keep connection alive during route changes
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, [token, connectWebSocket, closeConnection]);

  // Provide socket and connection status to children
  const value = {
    socket: socketRef.current,
    isConnected,
    sendMessage: (message) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("Cannot send message - WebSocket not connected");
        messageQueueRef.current.push(message);
      }
    },
    reconnect: () => connectWebSocket(true),
    closeConnection
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

/*export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};*/