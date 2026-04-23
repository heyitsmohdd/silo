import { useEffect, useState, useRef, useCallback } from 'react';
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

export interface TypingUser {
  userId: string;
  firstName: string;
}

// 
// Custom hook for chat functionality
// Manages socket connection, message state, and messaging actions

export const useChat = () => {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  // Initialize with current socket state to avoid effect update
  const [isConnected, setIsConnected] = useState(() => socketService.getSocket()?.connected ?? false);
  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Use existing connection or connect fresh
    const socket = socketService.getSocket();
    let newSocket = socket;
    if (!socket?.connected) {
      newSocket = socketService.connect(token);
    }

    if (!newSocket) return;

    const handleConnect = () => {
      setIsConnected(true);
      if (!hasLoadedHistory.current) {
        newSocket!.emit('getMessages', { limit: 50 });
        hasLoadedHistory.current = true;
      }
    };

    const handleDisconnect = () => setIsConnected(false);

    const handleConnectError = (error: Error) => {
      console.error('[Chat] Connection error:', error);
    };

    const handleMessageHistory = (data: { roomId: string; messages: Message[] }) => {
      setMessages(data.messages);
    };

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = (data: { userId: string; firstName: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (prev.some(u => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, firstName: data.firstName }];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('messageHistory', handleMessageHistory);
    newSocket.on('newMessage', handleNewMessage);
    newSocket.on('userTyping', handleUserTyping);

    // Socket already connected — emit getMessages immediately instead of waiting for 'connect'
    if (newSocket.connected && !hasLoadedHistory.current) {
      newSocket.emit('getMessages', { limit: 50 });
      hasLoadedHistory.current = true;
    }

    return () => {
      newSocket!.off('connect', handleConnect);
      newSocket!.off('disconnect', handleDisconnect);
      newSocket!.off('connect_error', handleConnectError);
      newSocket!.off('messageHistory', handleMessageHistory);
      newSocket!.off('newMessage', handleNewMessage);
      newSocket!.off('userTyping', handleUserTyping);
      hasLoadedHistory.current = false;
    };
  }, [token]);

  // 
  // Send a message to the chat

  const sendMessage = useCallback((content: string) => {
    const socket = socketService.getSocket();
    if (!socket || !content.trim()) return;

    socket.emit('sendMessage', {
      content: content.trim(),
    });
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    const socket = socketService.getSocket();
    if (!socket) return;
    socket.emit('typing', { isTyping });
  }, []);

  return {
    messages,
    sendMessage,
    sendTyping,
    typingUsers,
    isConnected,
    currentUser: user,
  };
};
