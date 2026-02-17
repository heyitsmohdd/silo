import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axios';
import { cn } from '@/lib/utils';

interface VotingButtonsProps {
    voteCount: number;
    upvotes: number;
    downvotes: number;
    onVoteSuccess: () => void;
    voteEndpoint: string; // e.g., '/academic/questions/123/vote'
    itemId: string; // For localStorage key
    size?: 'sm' | 'md';
}

const VotingButtons = ({
    voteCount,
    onVoteSuccess,
    voteEndpoint,
    itemId,
    size = 'md',
    className,
}: VotingButtonsProps & { className?: string }) => {
    const [isVoting, setIsVoting] = useState(false);
    const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

    // Load vote state from localStorage on mount
    useEffect(() => {
        const storedVote = localStorage.getItem(`vote_${itemId}`);
        if (storedVote === 'upvote' || storedVote === 'downvote') {
            setUserVote(storedVote);
        }
    }, [itemId]);

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (isVoting) return;

        setIsVoting(true);
        try {
            // Toggle logic: if clicking same vote, remove it
            if (userVote === voteType) {
                // Send opposite vote to cancel out
                const cancelVote = voteType === 'upvote' ? 'downvote' : 'upvote';
                await axiosClient.post(voteEndpoint, { voteType: cancelVote });
                setUserVote(null);
                localStorage.removeItem(`vote_${itemId}`);
            } else {
                // New vote or changing vote
                await axiosClient.post(voteEndpoint, { voteType });
                setUserVote(voteType);
                localStorage.setItem(`vote_${itemId}`, voteType);
            }
            onVoteSuccess();
        } catch (error) {
            console.error('Failed to vote:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const buttonSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('upvote');
                }}
                disabled={isVoting}
                className={`${buttonSize} rounded-md transition-all flex items-center justify-center disabled:opacity-50 ${userVote === 'upvote'
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'hover:bg-zinc-800'
                    }`}
                aria-label="Upvote"
            >
                <ArrowUp
                    className={`${iconSize} transition-colors ${userVote === 'upvote' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    fill={userVote === 'upvote' ? 'currentColor' : 'none'}
                />
            </button>

            <span
                className={`font-bold ${voteCount > 0
                    ? 'text-green-500'
                    : voteCount < 0
                        ? 'text-red-500'
                        : 'text-zinc-400'
                    } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
            >
                {voteCount}
            </span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('downvote');
                }}
                disabled={isVoting}
                className={`${buttonSize} rounded-md transition-all flex items-center justify-center disabled:opacity-50 ${userVote === 'downvote'
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'hover:bg-zinc-800'
                    }`}
                aria-label="Downvote"
            >
                <ArrowDown
                    className={`${iconSize} transition-colors ${userVote === 'downvote' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    fill={userVote === 'downvote' ? 'currentColor' : 'none'}
                />
            </button>
        </div>
    );
};

export default VotingButtons;
