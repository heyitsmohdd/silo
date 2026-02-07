import { MessageSquare, ArrowUp, CheckCircle2 } from 'lucide-react';
import { getIdentity } from '@/lib/identity';

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
        authorId: string;
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
    const identity = getIdentity(question.authorId);
    const voteCount = question.upvotes - question.downvotes;
    const answerCount = question.answers?.length || 0;
    const hasBestAnswer = question.bestAnswerId !== null;

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
        <div
            onClick={onClick}
            className="flex gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer group"
        >
            {/* Left: Voting Column */}
            <div className="flex flex-col items-center gap-1 pt-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Upvote logic here
                    }}
                    className="p-1.5 rounded hover:bg-zinc-800 transition-colors"
                >
                    <ArrowUp className={`w-5 h-5 ${voteCount > 0 ? 'text-green-500' : 'text-zinc-500'}`} />
                </button>
                <span className={`text-sm font-bold ${voteCount > 0 ? 'text-green-500' : 'text-zinc-400'}`}>
                    {voteCount}
                </span>
            </div>

            {/* Right: Content Column */}
            <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold text-zinc-100 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2 flex-1">
                        {question.title}
                    </h3>
                    {hasBestAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                </div>

                {/* Preview */}
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {question.content}
                </p>

                {/* Meta Row: Avatar + Posted by + Tags */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Avatar */}
                    <img
                        src={identity.avatar}
                        alt={identity.name}
                        className="w-5 h-5 rounded-full bg-zinc-900 ring-1 ring-zinc-800"
                    />

                    {/* Posted by */}
                    <span className="text-xs text-zinc-500">
                        Posted by <span className="text-zinc-400 font-medium">{identity.name}</span> • {formatTimeAgo(question.createdAt)}
                    </span>

                    {/* Answer Count */}
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                        {question.tags.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-800/60 text-zinc-400 border border-zinc-700"
                            >
                                {tag}
                            </span>
                        ))}
                        {question.tags.length > 2 && (
                            <span className="text-xs text-zinc-500">
                                +{question.tags.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
