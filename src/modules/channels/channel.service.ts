// 
// Channel Service Layer
// Business logic for public chat rooms


import { prisma } from '../../shared/lib/prisma.js';

// 
// Get all public channels

export const getAllChannels = async () => {
    return prisma.channel.findMany({
        where: {
            type: 'PUBLIC',
        },
        orderBy: {
            createdAt: 'asc',
        },
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            createdAt: true,
        },
    });
};

// 
// Get channel by ID

export const getChannelById = async (channelId: string) => {
    return prisma.channel.findUnique({
        where: { id: channelId },
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            ownerId: true,
            isDefault: true,
            createdAt: true,
        },
    });
};

// 
// Get channel messages with pagination

export const getChannelMessages = async (
    channelId: string,
    limit: number = 50
) => {
    return prisma.channelMessage.findMany({
        where: {
            channelId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        include: {
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
        },
    });
};

// 
// Create a new channel message

export const createChannelMessage = async (
    channelId: string,
    authorId: string,
    content: string
) => {
    return prisma.channelMessage.create({
        data: {
            channelId,
            authorId,
            content,
        },
        include: {
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    role: true,
                },
            },
        },
    });
};

// 
// Create a new channel

export const createChannel = async (
    name: string,
    description: string | null,
    ownerId: string
) => {
    return prisma.channel.create({
        data: {
            name: name.toLowerCase(),
            description,
            type: 'PUBLIC',
            ownerId,
            isDefault: false,
        },
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            ownerId: true,
            isDefault: true,
            createdAt: true,
        },
    });
};

// 
// Get channel members (users currently in the channel)

export const getChannelMembers = async (userIds: string[]) => {
    return prisma.user.findMany({
        where: {
            id: { in: userIds },
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
        },
    });
};
