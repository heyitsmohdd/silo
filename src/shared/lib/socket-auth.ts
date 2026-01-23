/**
 * Socket.io Authentication Helper
 * JWT verification for socket connections
 */

import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { JWTPayload } from '../types/auth.types.js';
import { parseJWTPayload } from '../schemas/auth.schema.js';

const JWT_SECRET = process.env['JWT_SECRET'];

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Extended Socket with user context
 */
export interface AuthenticatedSocket extends Socket {
    user?: JWTPayload;
    roomId?: string;
}

/**
 * Verify JWT token from socket handshake
 * Returns parsed JWT payload or null if invalid
 */
export const verifySocketToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as object;
        const payload = parseJWTPayload(decoded);
        return payload as JWTPayload;
    } catch (error) {
        return null;
    }
};

/**
 * Extract token from socket handshake
 * Supports both query params and auth header
 */
export const extractSocketToken = (socket: Socket): string | null => {
    // Try query parameter first
    const queryToken = socket.handshake.query['token'];
    if (queryToken && typeof queryToken === 'string') {
        return queryToken;
    }

    // Try auth header
    const authHeader = socket.handshake.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
    }

    return null;
};

/**
 * Generate room ID from batch context
 */
export const generateRoomId = (year: number, branch: string): string => {
    return `room_${year}_${branch}`;
};
