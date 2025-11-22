import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@shared/types/socket";

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use environment variable for API URL, fallback to localhost
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const socketInstance: SocketType = io(apiUrl, {
      transports: ["websocket", "polling"], // Allow fallback to polling for better compatibility
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
