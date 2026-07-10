import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(userId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlerRef = useRef(null);
  const groupMessageHandlerRef = useRef(null);

  // Connect on mount
  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for incoming direct messages
    socket.on("receive_message", (data) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    });

    // Listen for sent message confirmations (direct)
    socket.on("message_sent", (data) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    });

    // Listen for incoming group messages
    socket.on("receive_group_message", (data) => {
      if (groupMessageHandlerRef.current) {
        groupMessageHandlerRef.current(data);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Register a callback for incoming direct messages
  const onMessage = useCallback((handler) => {
    messageHandlerRef.current = handler;
  }, []);

  // Register a callback for incoming group messages
  const onGroupMessage = useCallback((handler) => {
    groupMessageHandlerRef.current = handler;
  }, []);

  // Send a message (direct or group)
  const sendMessage = useCallback((targetId, text, isGroup = false, senderName = "") => {
    if (socketRef.current?.connected) {
      if (isGroup) {
        socketRef.current.emit("send_message", {
          senderId: userId,
          groupId: targetId,
          text,
          senderName,
        });
      } else {
        socketRef.current.emit("send_message", {
          senderId: userId,
          receiverId: targetId,
          text,
        });
      }
    }
  }, [userId]);

  // Join a specific group room (e.g. after creating or being added to a group)
  const joinGroup = useCallback((groupId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_group", groupId);
    }
  }, []);

  return { sendMessage, onMessage, onGroupMessage, joinGroup, isConnected };
}
