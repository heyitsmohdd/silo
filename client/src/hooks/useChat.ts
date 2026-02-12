import { useEffect, useState, useRef } from 'react';
import { useAuthStore, type User } from '@/stores/useAuthStore';
import socketService from '@/lib/socket';

// Re-export User type for convenience
export type { User };

export interface Message {
  id: string;
  content: string;
  roomId: string;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username?: string;
    role: string;
  };
  createdAt: string;
}

/**
 * Custom hook for chat functionality
 * Manages socket connection, message state, and messaging actions
 */
export const useChat = () => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Connect socket with token
    const socket = socketService.getSocket();

    // If socket already exists, just use it
    if (socket?.connected) {
      setIsConnected(true);
      return;
    }

    // Connect fresh
    const newSocket = socketService.connect(token);

    // Remove any existing listeners to prevent duplicates
    newSocket.removeAllListeners('connect');
    newSocket.removeAllListeners('disconnect');
    newSocket.removeAllListeners('connect_error');
    newSocket.removeAllListeners('newMessage');
    newSocket.removeAllListeners('messageHistory');

    // Connection state handlers
    newSocket.on('connect', () => {
      setIsConnected(true);

      // Load message history on connect
      if (!hasLoadedHistory.current) {
        newSocket.emit('getMessages', { limit: 50 });
        hasLoadedHistory.current = true;
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Chat] Connection error:', error);
    });

    // Message handlers
    newSocket.on('messageHistory', (data: { roomId: string; messages: Message[] }) => {
      setMessages(data.messages);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  /**
   * Send a message to the chat
   */
  const sendMessage = (content: string) => {
    const socket = socketService.getSocket();
    if (!socket || !content.trim()) return;

    socket.emit('sendMessage', {
      content: content.trim(),
    });
  };

  return {
    messages,
    sendMessage,
    isConnected,
    currentUser: user,
  };
};
