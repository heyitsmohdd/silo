/**
 * Channel API Functions
 * HTTP requests for channel data
 */

import axios from '@/lib/axios';

export interface Channel {
    id: string;
    name: string;
    description: string | null;
    type: 'PUBLIC' | 'PRIVATE';
    ownerId: string | null;
    isDefault: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
}

export interface ChannelMessage {
    id: string;
    content: string;
    channelId: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        role: string;
    };
    createdAt: string;
}

/**
 * Fetch all public channels
 */
export const fetchChannels = async (): Promise<Channel[]> => {
    const response = await axios.get('/api/channels');
    return response.data.channels;
};

/**
 * Fetch channel message history
 */
export const fetchChannelMessages = async (
    channelId: string,
    limit: number = 50
): Promise<ChannelMessage[]> => {
    const response = await axios.get(`/api/channels/${channelId}/messages`, {
        params: { limit },
    });
    return response.data.messages;
};

/**
 * Fetch single channel details
 */
export const fetchChannel = async (channelId: string): Promise<Channel> => {
    const response = await axios.get(`/api/channels/${channelId}`);
    return response.data.channel;
};

/**
 * Create a new channel
 */
export const createChannel = async (
    name: string,
    description?: string
): Promise<Channel> => {
    const response = await axios.post('/api/channels', { name, description });
    return response.data.channel;
};

/**
 * Delete a channel (owner only)
 */
export const deleteChannel = async (channelId: string): Promise<void> => {
    await axios.delete(`/api/channels/${channelId}`);
};
