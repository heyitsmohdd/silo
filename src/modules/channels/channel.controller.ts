/**
 * Channel Controller
 * HTTP handlers for channel API endpoints
 */

import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../../shared/types/express.types.js';
import {
    getAllChannels,
    getChannelById,
    getChannelMessages,
    createChannel,
} from './channel.service.js';
import { deleteChannel } from './channel-cleanup.service.js';
import { io } from '../../index.js';

/**
 * GET /api/channels
 * List all public channels
 */
export const listChannels = async (
    _req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const channels = await getAllChannels();
        res.status(200).json({ channels });
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
};

/**
 * GET /api/channels/:id
 * Get channel details
 */
export const getChannel = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('Channel ID is required');
        const channel = await getChannelById(id);

        if (!channel) {
            res.status(404).json({ error: 'Channel not found' });
            return;
        }

        res.status(200).json({ channel });
    } catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ error: 'Failed to fetch channel' });
    }
};

/**
 * GET /api/channels/:id/messages
 * Get channel message history
 */
export const getMessages = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('Channel ID is required');
        const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 50;

        const messages = await getChannelMessages(id, limit);

        // Reverse to show oldest first
        res.status(200).json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Error fetching channel messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

/**
 * Zod schema for channel creation
 */
const createChannelSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
    description: z.string().optional(),
});

/**
 * POST /api/channels
 * Create a new channel
 */
export const createChannelHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        console.log('📝 Creating channel request body:', req.body);
        console.log('👤 User creating channel:', req.user);

        // Validate request body
        const validation = createChannelSchema.safeParse(req.body);

        if (!validation.success) {
            console.error('❌ Validation failed:', validation.error);
            res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors
            });
            return;
        }

        const { name, description } = validation.data;
        const userId = req.user!.userId;

        console.log(`🛠️ Creating channel "${name}" for owner ${userId}`);

        // Create channel
        const channel = await createChannel(
            name,
            description || null,
            userId
        );

        console.log('✅ Channel created successfully:', channel);

        // Emit socket event for real-time updates
        io.emit('channel_created', channel);
        console.log(`📢 New channel created: #${channel.name} by user ${userId}`);

        res.status(201).json(channel);
    } catch (error: any) {
        console.error('❌ Error creating channel:', error);

        // Handle unique constraint violation
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Channel name already exists' });
            return;
        }

        res.status(500).json({
            error: 'Failed to create channel',
            details: error.message
        });
    }
};

/**
 * DELETE /api/channels/:id
 * Delete a channel (owner only)
 */
export const deleteChannelHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        if (!id) {
            res.status(400).json({ error: 'Channel ID is required' });
            return;
        }

        const channel = await getChannelById(id);

        if (!channel) {
            res.status(404).json({ error: 'Channel not found' });
            return;
        }

        if (channel.isDefault) {
            res.status(403).json({ error: 'Cannot delete default channels' });
            return;
        }

        if (channel.ownerId !== userId) {
            res.status(403).json({ error: 'Only the owner can delete this channel' });
            return;
        }

        await deleteChannel(id, io);

        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ error: 'Failed to delete channel' });
    }
};
