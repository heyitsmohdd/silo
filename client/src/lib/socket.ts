import { io, Socket } from 'socket.io-client';

/**
 * Singleton Socket Service for managing Socket.io connection
 * Ensures only one connection exists throughout the application lifecycle
 */
class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;

    private constructor() { }

    /**
     * Get singleton instance
     */
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    /**
     * Connect to Socket.io server with JWT authentication
     * @param token - JWT token from auth store
     */
    public connect(token: string): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io('http://localhost:3000', {
            query: {
                token,
            },
        });

        this.socket.on('connect', () => {
            console.log('[Socket] Connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect and clean up socket connection
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Get current socket instance
     */
    public getSocket(): Socket | null {
        return this.socket;
    }
}

export default SocketService.getInstance();
