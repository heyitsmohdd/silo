import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import { prisma } from '../../shared/lib/prisma.js';

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const userId = req.user.userId;

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: {
                    where: { id: { not: userId } },
                    select: { id: true, username: true, firstName: true, lastName: true, role: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { content: true, createdAt: true, senderId: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        res.status(200).json({ conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getConversationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { conversationId } = req.params;
        const userId = req.user.userId;

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: { some: { id: userId } }
            },
            include: {
                participants: {
                    where: { id: { not: userId } },
                    select: { id: true, username: true, firstName: true, lastName: true, role: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { content: true, createdAt: true, senderId: true }
                }
            }
        });

        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }

        res.status(200).json({ conversation });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const initiateConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { targetUserId } = req.body;
        const myUserId = req.user.userId;

        if (!targetUserId || typeof targetUserId !== 'string') {
            res.status(400).json({ error: 'targetUserId is required' });
            return;
        }

        if (targetUserId === myUserId) {
            res.status(400).json({ error: 'Cannot message yourself' });
            return;
        }

        // Check if conversation already exists between these EXACT two users
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: myUserId } } },
                    { participants: { some: { id: targetUserId } } }
                ]
            }
        });

        if (existingConversation) {
            res.status(200).json({ conversationId: existingConversation.id });
            return;
        }

        // Check for blocks before initiating
        const isBlocked = await prisma.block.findFirst({
            where: {
                OR: [
                    { blockerId: myUserId, blockedId: targetUserId },
                    { blockerId: targetUserId, blockedId: myUserId }
                ]
            }
        });

        if (isBlocked) {
            res.status(403).json({ error: 'This user is unavailable for messaging' });
            return;
        }

        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: myUserId }, { id: targetUserId }]
                }
            }
        });

        res.status(201).json({ conversationId: newConversation.id });
    } catch (error) {
        console.error('Error initiating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { conversationId } = req.params;
        const { cursor } = req.query; // The ID of the oldest message currently on the client

        if (!conversationId) {
            res.status(400).json({ error: 'Conversation ID required' });
            return;
        }

        // Ensure user is part of the conversation
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: { some: { id: req.user.userId } }
            }
        });

        if (!conversation) {
            res.status(403).json({ error: 'Not authorized or conversation not found' });
            return;
        }

        const MESSAGES_LIMIT = 20;

        const messages = await prisma.directMessage.findMany({
            where: {
                conversationId: conversationId
            },
            take: MESSAGES_LIMIT + 1, // Take +1 to check if there are more
            cursor: cursor ? { id: String(cursor) } : undefined,
            skip: cursor ? 1 : 0, // Skip the cursor message itself
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sender: { select: { id: true, username: true, firstName: true, lastName: true } }
            }
        });

        const hasNextPage = messages.length > MESSAGES_LIMIT;
        const returnedMessages = hasNextPage ? messages.slice(0, -1) : messages;

        res.status(200).json({
            messages: returnedMessages,
            nextCursor: hasNextPage ? returnedMessages[returnedMessages.length - 1]?.id : null
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const blockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { targetUserId } = req.body;
        const myUserId = req.user.userId;

        if (!targetUserId || typeof targetUserId !== 'string') {
            res.status(400).json({ error: 'targetUserId is required' });
            return;
        }

        if (targetUserId === myUserId) {
            res.status(400).json({ error: 'Cannot block yourself' });
            return;
        }

        await prisma.block.create({
            data: {
                blockerId: myUserId,
                blockedId: targetUserId
            }
        });

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error: any) {
        // Handle unique constraint violation gracefully
        if (error.code === 'P2002') {
            res.status(200).json({ message: 'User is already blocked' });
            return;
        }

        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const unblockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { targetUserId } = req.body;
        const myUserId = req.user.userId;

        if (!targetUserId || typeof targetUserId !== 'string') {
            res.status(400).json({ error: 'targetUserId is required' });
            return;
        }

        await prisma.block.deleteMany({
            where: {
                blockerId: myUserId,
                blockedId: targetUserId
            }
        });

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const checkBlockStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const { targetUserId } = req.params;
        const myUserId = req.user.userId;

        if (!targetUserId) {
            res.status(400).json({ error: 'targetUserId is required' });
            return;
        }

        // Check both directions
        const blockRecord = await prisma.block.findFirst({
            where: {
                OR: [
                    { blockerId: myUserId, blockedId: targetUserId },
                    { blockerId: targetUserId, blockedId: myUserId }
                ]
            }
        });

        if (!blockRecord) {
            res.status(200).json({ isBlocked: false, blockedByMe: false, blockedByThem: false });
            return;
        }

        res.status(200).json({
            isBlocked: true,
            blockedByMe: blockRecord.blockerId === myUserId,
            blockedByThem: blockRecord.blockerId === targetUserId
        });
    } catch (error) {
        console.error('Error checking block status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
