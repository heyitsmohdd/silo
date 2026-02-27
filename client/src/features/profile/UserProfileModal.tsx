import { useState, useEffect } from 'react';
import { Mail, MessageCircle, X } from 'lucide-react';
import axiosClient from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';

interface UserProfileModalProps {
    userId: string;
    identity: {
        name: string;
        avatar: string;
    };
    onClose: () => void;
}

const UserProfileModal = ({ userId, identity, onClose }: UserProfileModalProps) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<{
        role?: string;
        year?: number;
        branch?: string;
    } | null>(null);

    // Don't show modal if clicking own avatar
    const isSelf = user?.userId === userId;

    useEffect(() => {
        // Fetch additional public profile data if needed in the future
    }, [userId]);

    const handleMessageClick = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await axiosClient.post('/api/dm/conversations/initiate', {
                targetUserId: userId
            });

            const conversationId = response.data.conversationId;
            onClose(); // Close the modal
            navigate(`/messages/${conversationId}`); // Redirect to the conversation
        } catch (error: any) {
            console.error('Failed to initiate conversation:', error);
            const msg = error.response?.data?.error || 'Failed to start conversation. Please try again.';
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header/Cover Image (Decorative) */}
                <div className="h-24 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-b border-zinc-800/50" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full transition-colors backdrop-blur-md"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="px-6 pb-6 relative">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6">
                        <img
                            src={identity.avatar}
                            alt={identity.name}
                            className="w-24 h-24 rounded-full bg-zinc-900 ring-4 ring-zinc-900 shadow-xl"
                        />
                    </div>

                    <div className="pt-14 pb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {identity.name}
                            </h2>
                            <div className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Anon</span>
                            </div>
                        </div>

                        {/* We hide real details to preserve anonymity, but show they are a verified student */}
                        <div className="mt-2 text-sm text-zinc-400 flex items-center gap-2">
                            <span>Verified Student</span>
                        </div>
                    </div>

                    {!isSelf && (
                        <div className="pt-2 border-t border-zinc-800/50">
                            <Button
                                onClick={handleMessageClick}
                                disabled={isLoading}
                                className="w-full mt-2 bg-white text-black hover:bg-zinc-200"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                {isLoading ? 'Opening...' : 'Send Message'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
