import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import socketService from '@/lib/socket';

/**
 * Hook to manage global socket connection
 * Should be used in a top-level layout component
 */
export const useSocketConnection = () => {
    const { token, user } = useAuthStore();

    useEffect(() => {
        if (!token || !user) {
            // Disconnect if no token/user
            if (socketService.getSocket()?.connected) {
                console.log('🔌 [useSocketConnection] Disconnecting socket (no auth)');
                socketService.disconnect();
            }
            return;
        }

        const socket = socketService.getSocket();

        // If already connected, do nothing
        if (socket?.connected) {
            return;
        }

        console.log('🔌 [useSocketConnection] Initiating connection');
        socketService.connect(token);

        return () => {
            // Optional: Disconnect on unmount? 
            // Usually we want to keep it open unless user logs out.
            // But if the layout unmounts (e.g. redirect to login), we should disconnect.
            // socketService.disconnect();
        };
    }, [token, user]);
};
