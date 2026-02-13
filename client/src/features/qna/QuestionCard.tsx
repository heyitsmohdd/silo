import { useState } from 'react';
import { MessageSquare, CheckCircle2, Book, Coffee, Megaphone, VenetianMask, MessageCircle, Trash2 } from 'lucide-react';
import { getIdentity } from '@/lib/identity';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import VotingButtons from './VotingButtons';


interface QuestionCardProps {
    question: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        upvotes: number;
        downvotes: number;
        reactions: any[]; // Array of reactions
        category: string;
        answers: any[];
        bestAnswerId: string | null;
        authorId: string;
        author: {
            firstName: string | null;
            lastName: string | null;
            email: string;
            username?: string;
        };
        createdAt: string;
    };
    onClick: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
}

const QuestionCard = ({ question, onClick, onUpdate, onDelete }: QuestionCardProps) => {
    const identity = getIdentity(question.authorId, question.author.username);
    const { user } = useAuthStore();

    // Check if current user is the author
    const isAuthor = user?.userId === question.authorId;

    const [reactions, setReactions] = useState(question.reactions || []);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle delete click (opens modal)
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    // Confirm delete action
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/academic/questions/${question.id}`);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
            // Optional: Show toast error here
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Handle Reaction Click
    const handleReaction = async (type: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) return;

        // Optimistic UI Update
        const existingReactionIndex = reactions.findIndex((r: any) => r.userId === user.userId);
        const existingReaction = reactions[existingReactionIndex];

        let newReactions = [...reactions];

        if (existingReaction) {
            if (existingReaction.type === type) {
                // Toggling off
                newReactions = reactions.filter((r: any) => r.userId !== user.userId);
            } else {
                // Switching type (Update the existing reaction object)
                newReactions[existingReactionIndex] = { ...existingReaction, type };
            }
        } else {
            // Adding new
            newReactions.push({ userId: user.userId, type });
        }

        setReactions(newReactions);

        // Call API
        try {
            await axiosClient.post('/academic/reactions', { questionId: question.id, type });
        } catch (err) {
            console.error('Failed to react', err);
            // Revert on error
            setReactions(reactions);
        }
    };

    // Calculate Reaction Counts
    const reactionCounts = ["🔥", "💀", "❤️", "💩"].map(emoji => ({
        emoji,
        count: reactions.filter((r: any) => r.type === emoji).length,
        userReacted: user ? reactions.some((r: any) => r.userId === user.userId && r.type === emoji) : false
    }));

    const answerCount = question.answers?.length || 0;
    const hasBestAnswer = question.bestAnswerId !== null;
    const voteCount = question.upvotes - question.downvotes;

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

    // Category Badge Helper
    const getCategoryBadge = (category: string = 'ACADEMIC') => {
        switch (category) {
            case "ACADEMIC": return { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <Book className="w-3 h-3" />, label: "Academic" };
            case "GOSSIP": return { color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: <Coffee className="w-3 h-3" />, label: "Tea / Gossip" };
            case "RANT": return { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <Megaphone className="w-3 h-3" />, label: "Rant" };
            case "CONFESSION": return { color: "bg-pink-500/10 text-pink-500 border-pink-500/20", icon: <VenetianMask className="w-3 h-3" />, label: "Confession" };
            default: return { color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: <MessageCircle className="w-3 h-3" />, label: "General" };
        }
    };

    const badge = getCategoryBadge(question.category);

    return (
        <div
            onClick={onClick}
            className="flex gap-4 p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer group shadow-sm hover:shadow-md"
        >
            {/* Voting Column */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center pt-1"
            >
                <VotingButtons
                    voteCount={voteCount}
                    upvotes={question.upvotes}
                    downvotes={question.downvotes}
                    voteEndpoint={`/academic/questions/${question.id}/vote`}
                    itemId={question.id}
                    onVoteSuccess={onUpdate || (() => { })}
                    size="sm"
                />
            </div>

            {/* Content Column */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Header: Badge (Only show if NOT Academic) */}
                <div className="flex items-center justify-between">
                    {question.category !== 'ACADEMIC' && (
                        <div className={`flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full border ${badge.color}`}>
                            {badge.icon}
                            {badge.label}
                        </div>
                    )}

                    {/* Delete button for author */}
                    {isAuthor && (
                        <button
                            onClick={handleDeleteClick}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors ml-auto"
                            title="Delete question"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div>
                    <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-zinc-100 leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                            {question.title}
                        </h3>
                        {hasBestAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                        {question.content}
                    </p>
                </div>

                {/* Meta Row (Restored): Avatar + Posted by + Time + Answers + Tags */}
                <div className="flex items-center gap-3 flex-wrap text-xs text-zinc-500 mb-4">
                    {/* Avatar */}
                    <img
                        src={identity.avatar}
                        alt={identity.name}
                        className="w-5 h-5 rounded-full bg-zinc-900 ring-1 ring-zinc-800"
                    />

                    {/* Posted by & Time */}
                    <span>
                        Posted by <span className="text-zinc-400 font-medium">{identity.name}</span> • {formatTimeAgo(question.createdAt)}
                    </span>

                    {/* Answer Count */}
                    <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
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

                {/* Footer: Reactions */}
                <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50">
                    {reactionCounts.map(({ emoji, count, userReacted }) => (
                        <button
                            key={emoji}
                            onClick={(e) => handleReaction(emoji, e)}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors border",
                                userReacted
                                    ? "bg-primary/20 border-primary/50 text-emerald-400"
                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                            )}
                        >
                            <span>{emoji}</span>
                            {count > 0 && <span>{count}</span>}
                        </button>
                    ))}
                </div>
            </div>

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

export default QuestionCard;
