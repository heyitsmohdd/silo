import { MessageSquare, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
    question: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        upvotes: number;
        downvotes: number;
        answers: any[];
        bestAnswerId: string | null;
        author: {
            firstName: string | null;
            lastName: string | null;
            email: string;
        };
        createdAt: string;
    };
    onClick: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
}

const QuestionCard = ({ question, onClick }: QuestionCardProps) => {
    const authorName = question.author.firstName && question.author.lastName
        ? `${question.author.firstName} ${question.author.lastName}`
        : question.author.email.split('@')[0];

    const voteCount = question.upvotes - question.downvotes;
    const answerCount = question.answers?.length || 0;
    const hasBestAnswer = question.bestAnswerId !== null;

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

    return (
        <div
            onClick={onClick}
            className="group p-6 border border-border rounded-lg bg-card hover:shadow-md transition-all duration-200 hover:border-primary/50 cursor-pointer"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {question.title}
                    </h3>
                </div>
                {hasBestAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
            </div>

            {/* Content Preview */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {question.content}
            </p>

            {/* Tags */}
            {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary"
                        >
                            {tag}
                        </span>
                    ))}
                    {question.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            +{question.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {/* Vote Count */}
                    <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" />
                        <span className={voteCount > 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                            {voteCount}
                        </span>
                    </div>

                    {/* Answer Count */}
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{answerCount}</span>
                    </div>

                    {/* Date */}
                    <span className="text-xs">{formatDate(question.createdAt)}</span>
                </div>

                {/* Author */}
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {authorName}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
