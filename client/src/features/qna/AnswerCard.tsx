import { CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import VotingButtons from './VotingButtons';
import axiosClient from '@/lib/axios';

interface AnswerCardProps {
    answer: {
        id: string;
        content: string;
        authorId: string;
        author: {
            firstName: string | null;
            lastName: string | null;
            email: string;
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
}

const AnswerCard = ({
    answer,
    questionId,
    questionAuthorId,
    isBest,
    onUpdate,
}: AnswerCardProps) => {
    const { user } = useAuthStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingBest, setIsMarkingBest] = useState(false);

    const authorName =
        answer.author.firstName && answer.author.lastName
            ? `${answer.author.firstName} ${answer.author.lastName}`
            : answer.author.email.split('@')[0];

    const canDelete = user?.userId === answer.authorId;
    const canMarkBest = user?.userId === questionAuthorId && !isBest;

    const voteCount = answer.upvotes - answer.downvotes;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this answer?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await axiosClient.delete(`/academic/questions/${questionId}/answers/${answer.id}`);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete answer:', error);
        } finally {
            setIsDeleting(false);
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
        <div
            className={`p-6 border rounded-lg bg-card ${isBest ? 'border-green-500 shadow-md' : 'border-border'
                }`}
        >
            <div className="flex gap-4">
                {/* Voting Section */}
                <div className="flex-shrink-0">
                    <VotingButtons
                        voteCount={voteCount}
                        upvotes={answer.upvotes}
                        downvotes={answer.downvotes}
                        voteEndpoint={`/academic/questions/${questionId}/answers/${answer.id}/vote`}
                        onVoteSuccess={onUpdate}
                        size="md"
                    />
                </div>

                {/* Answer Content */}
                <div className="flex-1 min-w-0">
                    {/* Best Answer Badge */}
                    {isBest && (
                        <div className="flex items-center gap-1.5 mb-3 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Best Answer</span>
                        </div>
                    )}

                    {/* Answer Text */}
                    <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap mb-4">
                        {answer.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Answered by {authorName}</span>
                            <span>•</span>
                            <span>{formatDate(answer.createdAt)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {canMarkBest && (
                                <button
                                    onClick={handleMarkBest}
                                    disabled={isMarkingBest}
                                    className="text-xs px-3 py-1.5 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    {isMarkingBest ? 'Marking...' : 'Mark as Best'}
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                                    aria-label="Delete answer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswerCard;
