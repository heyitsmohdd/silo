export interface Conversation {
    id: string;
    participants: {
        id: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        role: string;
    }[];
    messages: {
        content: string;
        createdAt: string;
        senderId: string;
    }[];
    updatedAt: string;
}

export interface DirectMessage {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    conversationId: string;
    sender: {
        id: string;
        username?: string;
        firstName?: string;
        lastName?: string;
    };
}
