import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import VotingButtons from './VotingButtons';
import AnswerCard from './AnswerCard';
import AnswerForm from './AnswerForm';
import EmptyState from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import axiosClient from '@/lib/axios';

const QuestionDetail = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['question', questionId],
        queryFn: async () => {
            const response = await axiosClient.get(`/academic/questions/${questionId}`);
            return response.data.question;
        },
        enabled: !!questionId,
    });

    if (!questionId) {
        navigate('/qna');
        return null;
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                <ListSkeleton count={1} />
                <div className="h-40 bg-muted animate-pulse rounded" />
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
    const authorName =
        question.author.firstName && question.author.lastName
            ? `${question.author.firstName} ${question.author.lastName}`
            : question.author.email.split('@')[0];

    const voteCount = question.upvotes - question.downvotes;
    const answers = question.answers || [];

    // Sort answers: best answer first, then by vote count
    const sortedAnswers = [...answers].sort((a, b) => {
        if (a.id === question.bestAnswerId) return -1;
        if (b.id === question.bestAnswerId) return 1;
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/qna')}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Questions
            </button>

            {/* Question Section */}
            <div className="p-6 border border-border rounded-lg bg-card">
                <div className="flex gap-6">
                    {/* Voting Section */}
                    <div className="flex-shrink-0">
                        <VotingButtons
                            voteCount={voteCount}
                            upvotes={question.upvotes}
                            downvotes={question.downvotes}
                            voteEndpoint={`/academic/questions/${questionId}/vote`}
                            onVoteSuccess={refetch}
                            size="md"
                        />
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h1 className="text-2xl font-bold text-card-foreground mb-4">
                            {question.title}
                        </h1>

                        {/* Tags */}
                        {question.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {question.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Question Content */}
                        <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap mb-6">
                            {question.content}
                        </p>

                        {/* Question Footer */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
                            <span>Asked by {authorName}</span>
                            <span>•</span>
                            <span>{formatDate(question.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                    </h2>
                </div>

                {/* Answer List */}
                {sortedAnswers.length > 0 ? (
                    <div className="space-y-4">
                        {sortedAnswers.map((answer: any) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                                questionId={questionId}
                                questionAuthorId={question.authorId}
                                isBest={answer.id === question.bestAnswerId}
                                onUpdate={refetch}
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
        </div>
    );
};

export default QuestionDetail;
