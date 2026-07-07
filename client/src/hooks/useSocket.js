import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export function useSocket(userId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlerRef = useRef(null);

  // Connect on mount
  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    });

    // Listen for sent message confirmations
    socket.on("message_sent", (data) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Register a callback for incoming messages
  const onMessage = useCallback((handler) => {
    messageHandlerRef.current = handler;
  }, []);

  // Send a message
  const sendMessage = useCallback((receiverId, text) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", {
        senderId: userId,
        receiverId,
        text,
      });
    }
  }, [userId]);

  return { sendMessage, onMessage, isConnected };
}
