import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { getIdentity } from '@/lib/identity';
import { useAuthStore } from '@/stores/useAuthStore';
import VotingButtons from './VotingButtons';
import AnswerCard from './AnswerCard';
import AnswerForm from './AnswerForm';
import EmptyState from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import axiosClient from '@/lib/axios';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const QuestionDetail = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['question', questionId],
        queryFn: async () => {
            const response = await axiosClient.get(`/academic/questions/${questionId}`);
            return response.data.question;
        },
        enabled: !!questionId,
    });

    // Handle delete click (opens modal)
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    // Confirm delete action
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/academic/questions/${questionId}`);
            navigate('/qna');
        } catch (error) {
            console.error('Failed to delete question:', error);
            // Optional: Show toast error here
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Sort answers: best answer first, then by vote count
    const sortedAnswers = (data?.answers || []).sort((a: any, b: any) => {
        if (a.id === data?.bestAnswerId) return -1;
        if (b.id === data?.bestAnswerId) return 1;
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    });

    if (!questionId) {
        navigate('/qna');
        return null;
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-24 bg-zinc-800 animate-pulse rounded" />
                <ListSkeleton count={1} />
                <div className="h-40 bg-zinc-800 animate-pulse rounded" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <EmptyState
                icon={MessageSquare}
                title="Question not found"
                description="This question may have been deleted or you don't have access to it."
                action={{
                    label: 'Back to Questions',
                    onClick: () => navigate('/qna'),
                }}
            />
        );
    }

    const question = data;
    const identity = getIdentity(question.authorId, question.author.username);
    const voteCount = question.upvotes - question.downvotes;
    const answers = question.answers || [];
    const isAuthor = user?.userId === question.authorId;

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

    return (
        <div className="space-y-6">
            {/* Header with Back Button and Delete */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/qna')}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Questions
                </button>

                {isAuthor && (
                    <button
                        onClick={handleDeleteClick}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Question
                    </button>
                )}
            </div>

            {/* Question Section */}
            <div className="flex gap-4 p-6 bg-zinc-900/30 rounded-lg">
                {/* Voting Section - Left */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <VotingButtons
                        voteCount={voteCount}
                        upvotes={question.upvotes}
                        downvotes={question.downvotes}
                        voteEndpoint={`/academic/questions/${questionId}/vote`}
                        itemId={questionId}
                        onVoteSuccess={refetch}
                        size="md"
                    />
                </div>

                {/* Question Content - Right */}
                <div className="flex-1 min-w-0">
                    {/* Author Info - Top */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={identity.avatar}
                            alt={identity.name}
                            className="w-8 h-8 rounded-full bg-zinc-900 ring-1 ring-zinc-800"
                        />
                        <div>
                            <span className="text-sm font-medium text-zinc-300">{identity.name}</span>
                            <span className="text-xs text-zinc-500 ml-2">• {formatTimeAgo(question.createdAt)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-zinc-100 mb-4">
                        {question.title}
                    </h1>

                    {/* Question Content */}
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-4">
                        {question.content}
                    </p>

                    {/* Tags */}
                    {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800/60 text-zinc-400 border border-zinc-700"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-100">
                        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                    </h2>
                </div>

                {/* Answer List */}
                {sortedAnswers.length > 0 ? (
                    <div>
                        {sortedAnswers.map((answer: any, index: number) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                                questionId={questionId}
                                questionAuthorId={question.authorId}
                                isBest={answer.id === question.bestAnswerId}
                                onUpdate={refetch}
                                isLast={index === sortedAnswers.length - 1}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={MessageSquare}
                        title="No answers yet"
                        description="Be the first to answer this question!"
                    />
                )}
            </div>

            {/* Answer Form */}
            <AnswerForm questionId={questionId} onSuccess={refetch} />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Question?"
                description="Are you sure you want to delete this question? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default QuestionDetail;
