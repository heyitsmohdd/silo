// 
// Message Service Layer
// Business logic for real-time chat with batch isolation


import { prisma } from '../../shared/lib/prisma.js';
import { AppError } from '../../shared/middleware/error.middleware.js';

// 
// Create a new message (batch-scoped)

export const createMessage = async (data: {
    content: string;
    roomId: string;
    senderId: string;
    year: number;
    branch: string;
}) => {
    const message = await prisma.message.create({
        data: {
            content: data.content,
            roomId: data.roomId,
            senderId: data.senderId,
            year: data.year,
            branch: data.branch,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
        },
    });

    return message;
};

// 
// Get messages for a room (batch-scoped)

export const getRoomMessages = async (
    roomId: string,
    year: number,
    branch: string,
    limit: number = 50
) => {
    const messages = await prisma.message.findMany({
        where: {
            roomId,
            year,
            branch,
            isDeleted: false,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });

    return messages.reverse(); // Return in chronological order
};

// 
// Delete message (soft delete, author-only)

export const deleteMessage = async (
    messageId: string,
    senderId: string,
    year: number,
    branch: string
) => {
    // Verify message exists and user is the sender
    const existingMessage = await prisma.message.findFirst({
        where: {
            id: messageId,
            year,
            branch,
            senderId,
            isDeleted: false,
        },
    });

    if (!existingMessage) {
        throw new AppError(404, 'Message not found or you are not the sender');
    }

    await prisma.message.update({
        where: { id: messageId },
        data: { isDeleted: true },
    });

    return { message: 'Message deleted successfully' };
};
