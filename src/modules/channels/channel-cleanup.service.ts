// 
// Channel Cleanup Service
// Handles automatic deletion of empty rooms and cron-based cleanup


import cron from 'node-cron';
import { prisma } from '../../shared/lib/prisma.js';

// Store deletion timeouts for each channel
const deletionTimeouts = new Map<string, NodeJS.Timeout>();

// 
// Check and delete empty rooms older than 1 hour
// Runs on server startup and via cron job

export const checkEmptyRooms = async () => {
    const oneHourAgo = new Date(Date.now() - 60// 60// 1000);

    try {
        const emptyRooms = await prisma.channel.findMany({
            where: {
                isDefault: false,
                createdAt: { lt: oneHourAgo },
            },
        });

        console.log(`🧹 Found ${emptyRooms.length} empty rooms older than 1 hour`);

        for (const room of emptyRooms) {
            await deleteChannel(room.id);
        }
    } catch (error) {
        console.error('❌ Error checking empty rooms:', error);
    }
};

// 
// Start 60-minute deletion timeout for a channel
// Called when the last user leaves a channel

export const startChannelDeletionTimeout = (channelId: string, io: any) => {
    // Clear any existing timeout
    clearChannelTimeout(channelId);

    const timeout = setTimeout(async () => {
        console.log(`⏰ 60-minute timeout reached for channel: ${channelId}`);
        await deleteChannel(channelId, io);
    }, 60// 60// 1000); // 60 minutes

    deletionTimeouts.set(channelId, timeout);
    console.log(`⏱️  Started 60-minute deletion timer for channel: ${channelId}`);
};

// 
// Clear deletion timeout for a channel
// Called when a user joins before the timeout expires

export const clearChannelTimeout = (channelId: string) => {
    const timeout = deletionTimeouts.get(channelId);
    if (timeout) {
        clearTimeout(timeout);
        deletionTimeouts.delete(channelId);
        console.log(`✅ Cleared deletion timer for channel: ${channelId}`);
    }
};

// 
// Delete a channel and notify all users

export const deleteChannel = async (channelId: string, io?: any) => {
    try {
        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            console.log(`⚠️  Channel ${channelId} not found`);
            return;
        }

        if (channel.isDefault) {
            console.log(`⚠️  Cannot delete default channel: ${channel.name}`);
            return;
        }

        await prisma.channel.delete({ where: { id: channelId } });

        // Notify all users via socket
        if (io) {
            io.emit('channel_deleted', { channelId });
        }

        console.log(`🗑️  Deleted channel: ${channel.name} (${channelId})`);
    } catch (error) {
        console.error(`❌ Error deleting channel ${channelId}:`, error);
    }
};

// 
// Initialize cron job for periodic cleanup
// Runs every 30 minutes

export const initializeChannelCleanup = () => {
    console.log('🚀 Initializing channel cleanup service...');

    // Run every 30 minutes
    cron.schedule('*/30// *// *', async () => {
        console.log('🧹 Running scheduled channel cleanup...');
        await checkEmptyRooms();
    });

    // Run on startup
    console.log('🧹 Running initial channel cleanup...');
    checkEmptyRooms();
};
