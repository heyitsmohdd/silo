import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import AskQuestionModal from './AskQuestionModal';
import QuestionFilters from './QuestionFilters';
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
    };
    upvotes: number;
    downvotes: number;
    bestAnswerId: string | null;
    answers: any[];
}

const QuestionList = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes'>('newest');

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const response = await axiosClient.get('/academic/questions');
            return response.data;
        },
    });

    const questionsList = Array.isArray(data) ? data : (data?.questions || []);

    const filteredQuestions = useMemo(() => {
        if (!questionsList.length) return [];

        let filtered = [...questionsList];

        // Filter by search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((q: Question) =>
                q.title.toLowerCase().includes(lowerSearch) ||
                q.content.toLowerCase().includes(lowerSearch)
            );
        }

        // Filter by tag
        if (tagFilter) {
            filtered = filtered.filter((q: Question) => q.tags.includes(tagFilter));
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                filtered.sort((a: Question, b: Question) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case 'oldest':
                filtered.sort((a: Question, b: Question) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                break;
            case 'upvotes':
                filtered.sort((a: Question, b: Question) => b.upvotes - a.upvotes);
                break;
        }

        return filtered;
    }, [questionsList, searchTerm, tagFilter, sortBy]);

    const allTags = useMemo(() => {
        if (!questionsList.length) return [];
        const tags = new Set<string>();
        questionsList.forEach((q: Question) => q.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags);
    }, [questionsList]);

    const hasFilters = Boolean(searchTerm || tagFilter || sortBy !== 'newest');

    const handleClearFilters = () => {
        setSearchTerm('');
        setTagFilter('');
        setSortBy('newest');
    };

    if (isLoading) {
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

    if (isError) {
        return (
            <EmptyState
                icon={HelpCircle}
                title="Unable to load questions"
                description="There was an error loading the questions. Please try again."
                action={{
                    label: 'Try Again',
                    onClick: () => refetch(),
                }}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Header: Title + Filters + Action Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: Title */}
                <h1 className="text-xl font-bold text-zinc-100 whitespace-nowrap">Course Q&A</h1>

                {/* Right: Search + Filters + New Question Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {/* Search & Filter Section */}
                    {questionsList.length > 0 && (
                        <QuestionFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            tagFilter={tagFilter}
                            onTagFilterChange={setTagFilter}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            allTags={allTags}
                            hasFilters={hasFilters}
                            onClearFilters={handleClearFilters}
                        />
                    )}

                    {/* New Question Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 text-sm font-bold rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        New Question
                    </button>
                </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
                <EmptyState
                    icon={HelpCircle}
                    title={
                        hasFilters
                            ? 'No questions match your filters'
                            : 'No questions yet'
                    }
                    description={
                        hasFilters
                            ? 'Try adjusting your search or filters.'
                            : 'Be the first to ask a question!'
                    }
                    action={
                        !hasFilters
                            ? {
                                label: 'Ask Question',
                                onClick: () => setShowModal(true),
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="space-y-3">
                    {filteredQuestions.map((question: Question) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onClick={() => navigate(`/qna/${question.id}`)}
                            onUpdate={refetch}
                            onDelete={refetch}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AskQuestionModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default QuestionList;
