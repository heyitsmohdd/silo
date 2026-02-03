import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import axiosClient from '@/lib/axios';

interface VotingButtonsProps {
    voteCount: number;
    upvotes: number;
    downvotes: number;
    onVoteSuccess: () => void;
    voteEndpoint: string; // e.g., '/academic/questions/123/vote'
    size?: 'sm' | 'md';
}

const VotingButtons = ({
    voteCount,
    onVoteSuccess,
    voteEndpoint,
    size = 'md',
}: VotingButtonsProps) => {
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (isVoting) return;

        setIsVoting(true);
        try {
            await axiosClient.post(voteEndpoint, { voteType });
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
        <div className="flex flex-col items-center gap-1">
            {/* Upvote Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('upvote');
                }}
                disabled={isVoting}
                className={`${buttonSize} rounded-md hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center disabled:opacity-50`}
                aria-label="Upvote"
            >
                <ArrowUp className={`${iconSize} text-muted-foreground hover:text-green-600 dark:hover:text-green-400`} />
            </button>

            {/* Vote Count */}
            <span
                className={`font-medium ${voteCount > 0
                        ? 'text-green-600 dark:text-green-400'
                        : voteCount < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-muted-foreground'
                    } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
            >
                {voteCount}
            </span>

            {/* Downvote Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('downvote');
                }}
                disabled={isVoting}
                className={`${buttonSize} rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center disabled:opacity-50`}
                aria-label="Downvote"
            >
                <ArrowDown className={`${iconSize} text-muted-foreground hover:text-red-600 dark:hover:text-red-400`} />
            </button>
        </div>
    );
};

export default VotingButtons;
