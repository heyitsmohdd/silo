import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import CreateQuestionForm from './CreateQuestionForm';
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
    const [showForm, setShowForm] = useState(false);
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
                <div className="flex justify-end">
                    <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
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
        <div className="space-y-8">
            {/* Ask Question Button */}
            <div className="flex justify-end">
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Ask Question
                    </button>
                ) : (
                    <button
                        onClick={() => setShowForm(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Create Question Form */}
            {showForm && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <CreateQuestionForm onSuccess={() => {
                        setShowForm(false);
                        refetch();
                    }} />
                </div>
            )}

            {/* Filters */}
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

            {/* Questions Grid */}
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
                                onClick: () => setShowForm(true),
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
    );
};

export default QuestionList;
