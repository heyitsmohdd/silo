import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import socketService from '@/lib/socket';

// 
// Hook to access the current socket instance
// Updates when connection state changes

export const useSocket = (): Socket | null => {
    const [socket, setSocket] = useState<Socket | null>(socketService.getSocket());

    useEffect(() => {
        const unsubscribe = socketService.onConnectionChange((newSocket) => {
            setSocket(newSocket);
        });
        return unsubscribe;
    }, []);

    return socket;
};
