import { useEffect, useRef, useState } from "react";

interface WebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
}

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
}: WebSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;
  
    const socket = new WebSocket(url);
    socketRef.current = socket;
  
    socket.onopen = () => {
      setIsConnected(true);
      onOpen?.();
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };
  
    socket.onclose = () => {
      setIsConnected(false);
      onClose?.();
    };
  
    socket.onerror = (event) => {
      console.error("WebSocket error", event);
      onError?.(event);
    };
  
    return () => {
      socket.close();
    };
  }, [url]);
  

  return {
    socket: socketRef.current,
    isConnected,
  };
};
