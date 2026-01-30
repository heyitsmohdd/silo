import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import socketService from '@/lib/socket';

export interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
}

/**
 * Custom hook for chat functionality
 * Manages socket connection, message state, and messaging actions
 */
export const useChat = () => {
    const { token, user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        // Connect socket with token
        const socket = socketService.connect(token);

        // Connection state handlers
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Message handlers
        socket.on('receive_message', (message: Message) => {
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

        socket.emit('send_message', {
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
