import { io, Socket } from 'socket.io-client';

/**
 * Singleton Socket Service for managing Socket.io connection
 * Ensures only one connection exists throughout the application lifecycle
 */
class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private listeners: ((socket: Socket | null) => void)[] = [];

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
     * Subscribe to socket connection changes
     */
    public onConnectionChange(callback: (socket: Socket | null) => void) {
        this.listeners.push(callback);
        // Immediately verify current state
        callback(this.socket);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(cb => cb(this.socket));
    }

    /**
     * Connect to Socket.io server with JWT authentication
     * @param token - JWT token from auth store
     */
    public connect(token: string): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        // ---------------------------------------------------------
        // SMART SWITCH:
        // 1. If VITE_API_URL exists (Vercel/Render), use it.
        // 2. Otherwise, assume we are testing locally (localhost).
        // ---------------------------------------------------------
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        console.log('🔌 [SocketService] Connecting to:', BASE_URL);

        this.socket = io(BASE_URL, {
            query: {
                token,
            },
            transports: ['websocket', 'polling'], // Force websocket first, fall back to polling
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('✅ [Socket] Connected:', this.socket?.id);
            this.notifyListeners();
        });

        this.socket.on('connect_error', (err) => {
            console.error('❌ [Socket] Connection Error:', err.message);
            this.notifyListeners();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('⚠️ [Socket] Disconnected:', reason);
            this.notifyListeners();
        });

        this.notifyListeners();
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
            this.notifyListeners();
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
