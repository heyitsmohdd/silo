import { CheckCircle2, Trash2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { getIdentity } from '@/lib/identity';
import VotingButtons from './VotingButtons';
import axiosClient from '@/lib/axios';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface AnswerCardProps {
    answer: {
        id: string;
        content: string;
        authorId: string;
        author: {
            firstName: string | null;
            lastName: string | null;
            email: string;
            username?: string;
        };
        upvotes: number;
        downvotes: number;
        createdAt: string;
        bestQuestionId: string | null;
    };
    questionId: string;
    questionAuthorId: string;
    isBest: boolean;
    onUpdate: () => void;
    isLast?: boolean;
    onReply: () => void;
}

const AnswerCard = ({
    answer,
    questionId,
    questionAuthorId,
    isBest,
    onUpdate,
    isLast = false,
    onReply,
}: AnswerCardProps) => {
    const { user } = useAuthStore();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingBest, setIsMarkingBest] = useState(false);

    const identity = getIdentity(answer.authorId, answer.author.username);
    const canDelete = user?.userId === answer.authorId;
    const canMarkBest = user?.userId === questionAuthorId && !isBest;

    const voteCount = answer.upvotes - answer.downvotes;

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/academic/questions/${questionId}/answers/${answer.id}`);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete answer:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleMarkBest = async () => {
        setIsMarkingBest(true);
        try {
            await axiosClient.put(`/academic/questions/${questionId}/best-answer`, {
                answerId: answer.id,
            });
            onUpdate();
        } catch (error) {
            console.error('Failed to mark best answer:', error);
        } finally {
            setIsMarkingBest(false);
        }
    };


    return (
        <>
            <div className={`flex gap-4 py-4 ${!isLast ? 'border-b border-zinc-800' : ''}`}>
                {/* Left: Voting + Avatar */}
                <div className="flex gap-3">
                    {/* Voting Buttons */}
                    <VotingButtons
                        voteCount={voteCount}
                        upvotes={answer.upvotes}
                        downvotes={answer.downvotes}
                        voteEndpoint={`/academic/questions/${questionId}/answers/${answer.id}/vote`}
                        itemId={answer.id}
                        onVoteSuccess={onUpdate}
                        size="sm"
                    />

                    {/* Avatar */}
                    <img
                        src={identity.avatar}
                        alt={identity.name}
                        className="w-8 h-8 rounded-full bg-zinc-900 ring-1 ring-zinc-800"
                    />
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                    {/* Author and Time */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-zinc-300">{identity.name}</span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-500">{formatTimeAgo(answer.createdAt)}</span>
                        {isBest && (
                            <>
                                <span className="text-xs text-zinc-500">•</span>
                                <div className="flex items-center gap-1 text-green-500">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">Best Answer</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Answer Content */}
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-3">
                        {answer.content}
                    </p>

                    {/* Actions Row */}
                    <div className="flex items-center gap-4">
                        {/* Reply (placeholder) */}
                        <button
                            onClick={onReply}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply</span>
                        </button>

                        {/* Mark as Best */}
                        {canMarkBest && (
                            <button
                                onClick={handleMarkBest}
                                disabled={isMarkingBest}
                                className="text-xs text-green-500 hover:text-green-400 transition-colors disabled:opacity-50"
                            >
                                {isMarkingBest ? 'Marking...' : 'Mark as Best'}
                            </button>
                        )}

                        {/* Delete */}
                        {canDelete && (
                            <button
                                onClick={handleDeleteClick}
                                className="text-xs text-zinc-500 hover:text-red-400 transition-colors ml-auto"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Answer?"
                description="Are you sure you want to delete this answer? This action cannot be undone."
                confirmText="Delete Answer"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
};

export default AnswerCard;
