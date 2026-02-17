import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import AskQuestionModal from './AskQuestionModal';
import EmptyState from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import axiosClient from '@/lib/axios';


interface Question {
    id: string;
    title: string;
    content: string;
    tags: string[];
    year: number;
    branch: string;
    createdAt: string;
    authorId: string;
    author: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        username?: string;
    };
    upvotes: number;
    downvotes: number;
    bestAnswerId: string | null;
    answers: unknown[];
    reactions: { userId: string; type: string }[];
    category: string;
}

const QuestionList = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes'>('newest');
    const [activeTab, setActiveTab] = useState('for-you');

    // Questions Query
    const { data: questionsData, isLoading: isLoadingQuestions, isError: isErrorQuestions, refetch: refetchQuestions } = useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const response = await axiosClient.get('/academic/questions');
            return response.data;
        },
    });

    // News Query
    const { data: newsData, isLoading: isLoadingNews } = useQuery({
        queryKey: ['news-feed'],
        queryFn: async () => {
            try {
                const res = await axiosClient.get('/api/news');
                return res.data;
            } catch (e) {
                return [];
            }
        },
        enabled: activeTab === 'news',
        staleTime: 1000 * 60 * 60
    });

    const questionsList = useMemo(() => {
        return Array.isArray(questionsData) ? questionsData : (questionsData?.questions || []);
    }, [questionsData]);

    const filteredQuestions = useMemo(() => {
        if (!questionsList.length || activeTab === 'news') return [];

        let filtered = [...questionsList];

        switch (activeTab) {
            case 'trending':
                filtered.sort((a: Question, b: Question) => b.upvotes - a.upvotes);
                break;
            case 'tech':
                filtered = filtered.filter((q: Question) =>
                    q.tags.some(t => t.toLowerCase().includes('tech')) ||
                    q.category?.toLowerCase() === 'tech'
                );
                break;
            case 'events':
                filtered = filtered.filter((q: Question) =>
                    q.tags.some(t => t.toLowerCase().includes('event')) ||
                    q.category?.toLowerCase() === 'event'
                );
                break;
            case 'for-you':
            default:
                filtered.sort((a: Question, b: Question) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((q: Question) =>
                q.title.toLowerCase().includes(lowerSearch) ||
                q.content.toLowerCase().includes(lowerSearch)
            );
        }

        if (tagFilter) {
            filtered = filtered.filter((q: Question) => q.tags.includes(tagFilter));
        }

        if (activeTab !== 'news') {
            if (sortBy === 'oldest') {
                filtered.sort((a: Question, b: Question) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            } else if (sortBy === 'upvotes' && activeTab !== 'trending') {
                filtered.sort((a: Question, b: Question) => b.upvotes - a.upvotes);
            }
        }

        return filtered;
    }, [questionsList, searchTerm, tagFilter, sortBy, activeTab]);

    const allTags = useMemo(() => {
        if (!questionsList.length) return [];
        const tags = new Set<string>();
        questionsList.forEach((q: Question) => q.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags);
    }, [questionsList]);

    const hasFilters = Boolean(searchTerm || tagFilter || sortBy !== 'newest' || activeTab !== 'for-you');

    const handleClearFilters = () => {
        setSearchTerm('');
        setTagFilter('');
        setSortBy('newest');
        setActiveTab('for-you');
    };

    const tabs = [
        { id: 'for-you', label: 'For You' },
        { id: 'trending', label: 'Trending' },
        { id: 'tech', label: 'Tech' },
        { id: 'events', label: 'Events' },
        { id: 'news', label: 'News' },
    ];

    if (isLoadingQuestions) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-32 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-10 w-40 rounded-lg bg-zinc-800 animate-pulse" />
                </div>
                <ListSkeleton count={3} />
            </div>
        );
    }

    if (isErrorQuestions) {
        return (
            <EmptyState
                icon={HelpCircle}
                title="Unable to load questions"
                description="There was an error loading the questions. Please try again."
                action={{
                    label: 'Try Again',
                    onClick: () => refetchQuestions(),
                }}
            />
        );
    }

    // Custom Empty State Logic
    const renderEmptyState = () => {
        if (activeTab === 'tech') {
            return (
                <EmptyState
                    icon={Plus}
                    title="No Tech discussions yet"
                    description="Be the first to start a conversation about Technology!"
                    action={{ label: 'Start Discussion', onClick: () => setShowModal(true) }}
                />
            );
        }
        if (activeTab === 'events') {
            return (
                <EmptyState
                    icon={Plus}
                    title="No Events listed"
                    description="Know of an upcoming event? Share it with the community!"
                    action={{ label: 'Post Event', onClick: () => setShowModal(true) }}
                />
            );
        }

        // Default Empty State
        return (
            <EmptyState
                icon={HelpCircle}
                title={hasFilters ? 'No posts match your filters' : 'No posts yet'}
                description={hasFilters ? 'Try adjusting your search or filters.' : 'Be the first to start a discussion!'}
                action={!hasFilters ? { label: 'Start Discussion', onClick: () => setShowModal(true) } : undefined}
            />
        );
    };

    return (
        <div>
            {/* Header Container */}
            <div className="flex flex-col gap-6 mb-8">
                {/* Top Row: Title & New Question Button */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Discussion Board</h1>
                    {activeTab !== 'news' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    )}
                </div>

                {/* Bottom Row: Search & Filters */}
                {questionsList.length > 0 && activeTab !== 'news' && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-600"
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'upvotes')}
                                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-600"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="upvotes">Top</option>
                            </select>
                            {hasFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-zinc-800/50 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${activeTab === tab.id
                                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                                    : 'bg-zinc-900/40 text-zinc-400 border border-transparent hover:bg-zinc-800/60 hover:text-zinc-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'news' ? (
                <div className="space-y-3">
                    {isLoadingNews ? (
                        <ListSkeleton count={3} />
                    ) : !newsData || newsData.length === 0 ? (
                        <EmptyState
                            icon={HelpCircle}
                            title="No news available"
                            description="Check back later for the latest updates."
                        />
                    ) : (
                        newsData.map((item: any, idx: number) => (
                            <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-400 border border-zinc-700">
                                                {item.category || 'NEWS'}
                                            </span>
                                            <span className="text-xs text-zinc-500">• {new Date(item.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-zinc-100 mb-1 group-hover:text-emerald-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-zinc-400 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                                        <Plus className="w-5 h-5 rotate-45" />
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            ) : (
                filteredQuestions.length === 0 ? renderEmptyState() : (
                    <div className="space-y-3">
                        {filteredQuestions.map((question: Question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                onClick={() => navigate(`/qna/${question.id}`)}
                                onUpdate={refetchQuestions}
                                onDelete={refetchQuestions}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Modal */}
            {showModal && (
                <AskQuestionModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        refetchQuestions();
                    }}
                />
            )}
        </div>
    );
};

export default QuestionList;
