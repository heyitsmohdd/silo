/**
 * Socket.io Event Handlers
 * Real-time communication with batch isolation
 */

import { Server, Socket } from 'socket.io';
import { createMessage, getRoomMessages } from './message.service.js';
import {
    AuthenticatedSocket,
    verifySocketToken,
    extractSocketToken,
    generateRoomId,
} from '../../shared/lib/socket-auth.js';

// Beta security: Simple in-memory rate limiter for chat messages
const messageRateLimiter = new Map<string, { count: number; resetTime: number }>();
const MESSAGE_LIMIT = 30; // 30 messages per minute
const WINDOW_MS = 60 * 1000; // 1 minute

// User socket registry for targeted notifications
const userSockets = new Map<string, string>(); // userId -> socketId

/**
 * Emit notification to a specific user
 */
export const emitNotificationToUser = (io: Server, userId: string, notification: any) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification:new', notification);
        console.log(`🔔 Notification sent to user ${userId}`);
    }
};

/**
 * Initialize Socket.io handlers
 */
export const initializeSocketHandlers = (io: Server) => {
    // Middleware: Authenticate socket connections
    io.use((socket: Socket, next) => {
        const token = extractSocketToken(socket);

        if (!token) {
            return next(new Error('Authentication token required'));
        }

        const user = verifySocketToken(token);

        if (!user) {
            return next(new Error('Invalid or expired token'));
        }

        // Attach user to socket
        (socket as AuthenticatedSocket).user = user;
        next();
    });

    // Connection handler
    io.on('connection', (socket: Socket) => {
        const authSocket = socket as AuthenticatedSocket;
        const user = authSocket.user;

        if (!user) {
            socket.disconnect();
            return;
        }

        console.log(`✅ User connected: ${user.email} (${user.year} ${user.branch})`);

        // Register user socket for notifications
        userSockets.set(user.userId, socket.id);

        // Auto-join room based on batch context
        const roomId = generateRoomId(user.year, user.branch);
        authSocket.roomId = roomId;
        socket.join(roomId);

        console.log(`📍 User joined room: ${roomId}`);

        // Send welcome message
        socket.emit('connected', {
            message: 'Connected to chat',
            roomId,
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role,
            },
        });

        // Handle: Send message
        socket.on('sendMessage', async (data: { content: string }) => {
            try {
                if (!user || !roomId) {
                    socket.emit('error', { message: 'Not authenticated' });
                    return;
                }

                if (!data.content || data.content.trim().length === 0) {
                    socket.emit('error', { message: 'Message content is required' });
                    return;
                }

                // Beta security: Rate limiting
                const now = Date.now();
                const userKey = user.userId;
                const limiter = messageRateLimiter.get(userKey);

                if (limiter && now < limiter.resetTime) {
                    if (limiter.count >= MESSAGE_LIMIT) {
                        socket.emit('error', { message: 'Too many messages, please slow down.' });
                        return;
                    }
                    limiter.count++;
                } else {
                    messageRateLimiter.set(userKey, {
                        count: 1,
                        resetTime: now + WINDOW_MS,
                    });
                }

                // Save message to database
                const message = await createMessage({
                    content: data.content.trim(),
                    roomId,
                    senderId: user.userId,
                    year: user.year,
                    branch: user.branch,
                });

                // Broadcast to room (including sender)
                io.to(roomId).emit('newMessage', {
                    id: message.id,
                    content: message.content,
                    roomId: message.roomId,
                    sender: {
                        id: message.sender.id,
                        firstName: message.sender.firstName,
                        lastName: message.sender.lastName,
                        username: message.sender.username,
                        role: message.sender.role,
                    },
                    createdAt: message.createdAt,
                });

                console.log(`💬 Message sent to ${roomId}: ${message.content.substring(0, 50)}...`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle: Get message history
        socket.on('getMessages', async (data: { limit?: number }) => {
            try {
                if (!user || !roomId) {
                    socket.emit('error', { message: 'Not authenticated' });
                    return;
                }

                const messages = await getRoomMessages(
                    roomId,
                    user.year,
                    user.branch,
                    data.limit ?? 50
                );

                socket.emit('messageHistory', {
                    roomId,
                    messages: messages.map((msg) => ({
                        id: msg.id,
                        content: msg.content,
                        sender: {
                            id: msg.sender.id,
                            firstName: msg.sender.firstName,
                            lastName: msg.sender.lastName,
                            username: msg.sender.username,
                            role: msg.sender.role,
                        },
                        createdAt: msg.createdAt,
                    })),
                });
            } catch (error) {
                console.error('Error fetching messages:', error);
                socket.emit('error', { message: 'Failed to fetch messages' });
            }
        });

        // Handle: User typing indicator
        socket.on('typing', (data: { isTyping: boolean }) => {
            if (!roomId) return;

            socket.to(roomId).emit('userTyping', {
                userId: user?.userId,
                firstName: user?.email.split('@')[0],
                isTyping: data.isTyping,
            });
        });

        // Handle: Disconnect
        socket.on('disconnect', () => {
            userSockets.delete(user.userId);
            console.log(`❌ User disconnected: ${user.email}`);
        });
    });
};
