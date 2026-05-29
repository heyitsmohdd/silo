import { useState, type ReactNode, type MouseEvent } from 'react';
import { MessageSquare, CheckCircle2, Book, Coffee, Megaphone, VenetianMask, MessageCircle, Trash2, Laptop, Calendar, Newspaper } from 'lucide-react';
import { getIdentity } from '@/lib/identity';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import VotingButtons from './VotingButtons';
import UserProfileModal from '../profile/UserProfileModal';

interface Reaction {
    id?: string;
    userId: string;
    type: string;
}

interface QuestionCardProps {
    question: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        upvotes: number;
        downvotes: number;
        reactions: Reaction[];
        category: string;
        answers: unknown[];
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

interface CategoryConfig {
    badge: string;
    icon: ReactNode;
    label: string;
}

const getCategoryConfig = (category: string): CategoryConfig => {
    switch (category) {
        case 'TECH':      return { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',    icon: <Laptop className="w-3 h-3" />,       label: 'Tech' };
        case 'EVENT':     return { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <Calendar className="w-3 h-3" />,    label: 'Event' };
        case 'NEWS':      return { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <Newspaper className="w-3 h-3" />, label: 'News' };
        case 'ACADEMIC':  return { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     icon: <Book className="w-3 h-3" />,         label: 'Academic' };
        case 'GOSSIP':    return { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <Coffee className="w-3 h-3" />,      label: 'Tea' };
        case 'RANT':      return { badge: 'bg-red-500/10 text-red-400 border-red-500/20',        icon: <Megaphone className="w-3 h-3" />,    label: 'Rant' };
        case 'CONFESSION':return { badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20',     icon: <VenetianMask className="w-3 h-3" />, label: 'Confession' };
        default:          return { badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-700',        icon: <MessageCircle className="w-3 h-3" />, label: 'General' };
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
};

const REACTION_EMOJIS = ['🔥', '💀', '❤️', '💩'];
const GIF_REGEX = /!\[GIF\]\((https:\/\/media[^)]+\.giphy\.com[^)]+)\)/;

const QuestionCard = ({ question, onClick, onUpdate, onDelete }: QuestionCardProps) => {
    const identity = getIdentity(question.authorId, question.author.username);
    const { user } = useAuthStore();
    const isAuthor = user?.userId === question.authorId;

    const [reactions, setReactions] = useState(question.reactions ?? []);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const categoryConfig = getCategoryConfig(question.category);
    const gifMatch = question.content.match(GIF_REGEX);
    const contentText = gifMatch ? question.content.replace(GIF_REGEX, '').trim() : question.content;

    const answerCount = question.answers?.length ?? 0;
    const hasBestAnswer = question.bestAnswerId !== null;
    const voteCount = question.upvotes - question.downvotes;

    const reactionCounts = REACTION_EMOJIS.map(emoji => ({
        emoji,
        count: reactions.filter((r: Reaction) => r.type === emoji).length,
        userReacted: user ? reactions.some((r: Reaction) => r.userId === user.userId && r.type === emoji) : false,
    }));

    const hasActiveReactions = reactionCounts.some(r => r.count > 0);

    const handleDeleteClick = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/academic/questions/${question.id}`);
            onDelete?.();
        } catch (error) {
            console.error('Failed to delete question:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleReaction = async (type: string, e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (!user) return;

        const existingIndex = reactions.findIndex((r: Reaction) => r.userId === user.userId);
        const existing = reactions[existingIndex];
        let updatedReactions = [...reactions];

        if (existing) {
            if (existing.type === type) {
                updatedReactions = reactions.filter((r: Reaction) => r.userId !== user.userId);
            } else {
                updatedReactions[existingIndex] = { ...existing, type };
            }
        } else {
            updatedReactions.push({ userId: user.userId, type });
        }

        setReactions(updatedReactions);
        try {
            await axiosClient.post('/academic/reactions', { questionId: question.id, type });
        } catch {
            setReactions(reactions);
        }
    };

    return (
        <>
            <div
                onClick={onClick}
                className="flex bg-zinc-900 border border-zinc-800/80 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/40 transition-all duration-150 cursor-pointer group"
            >
                {/* Vote column */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center pt-4 px-3 shrink-0 border-r border-zinc-800/60"
                >
                    <VotingButtons
                        voteCount={voteCount}
                        upvotes={question.upvotes}
                        downvotes={question.downvotes}
                        voteEndpoint={`/academic/questions/${question.id}/vote`}
                        itemId={question.id}
                        onVoteSuccess={onUpdate ?? (() => {})}
                        size="sm"
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0 px-4 py-4">
                    {/* Author row — above content like AO */}
                    <div className="flex items-center gap-2.5 mb-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsProfileModalOpen(true); }}
                            className="shrink-0 hover:opacity-80 active:scale-95 transition-all"
                        >
                            <img
                                src={identity.avatar}
                                alt={identity.name}
                                className="w-8 h-8 rounded-full ring-1 ring-zinc-700/60"
                            />
                        </button>
                        <div className="flex items-center gap-1.5 text-sm min-w-0">
                            <span className="font-medium text-zinc-200 truncate">{identity.name}</span>
                            <span className="text-zinc-600">·</span>
                            <span className="text-zinc-500 text-xs whitespace-nowrap">{formatDate(question.createdAt)}</span>
                        </div>
                        {isAuthor && (
                            <button
                                onClick={handleDeleteClick}
                                className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-all shrink-0"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-2 mb-2">
                        <h3 className="flex-1 text-[15px] font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors line-clamp-2 break-words">
                            {question.title}
                        </h3>
                        {hasBestAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                    </div>

                    {/* Content preview */}
                    {contentText && (
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 break-words mb-3">
                            {contentText}
                        </p>
                    )}
                    {gifMatch && (
                        <img src={gifMatch[1]} alt="GIF" className="rounded-md max-w-[200px] mb-3 object-cover" />
                    )}

                    {/* Bottom meta row */}
                    <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
                        </span>

                        <div className="flex items-center gap-1.5 ml-auto">
                            {question.category !== 'ACADEMIC' && (
                                <span className={cn(
                                    'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border',
                                    categoryConfig.badge
                                )}>
                                    {categoryConfig.icon}
                                    {categoryConfig.label}
                                </span>
                            )}
                            {question.tags.slice(0, 1).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60 truncate max-w-[100px]"
                                >
                                    {tag}
                                </span>
                            ))}
                            {question.tags.length > 1 && (
                                <span className="text-zinc-600 text-[10px]">+{question.tags.length - 1}</span>
                            )}
                        </div>
                    </div>

                    {/* Reactions */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            'flex items-center gap-1 mt-3 pt-2.5 border-t border-zinc-800/50 transition-opacity',
                            !hasActiveReactions && 'opacity-0 group-hover:opacity-100'
                        )}
                    >
                        {reactionCounts.map(({ emoji, count, userReacted }) => (
                            <button
                                key={emoji}
                                onClick={(e) => handleReaction(emoji, e)}
                                className={cn(
                                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all',
                                    userReacted
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                )}
                            >
                                <span>{emoji}</span>
                                {count > 0 && <span className="font-medium">{count}</span>}
                            </button>
                        ))}
                    </div>
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

            {isProfileModalOpen && (
                <UserProfileModal
                    userId={question.authorId}
                    identity={identity}
                    onClose={() => setIsProfileModalOpen(false)}
                />
            )}
        </>
    );
};

export default QuestionCard;
