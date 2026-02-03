import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import QuestionCard from './QuestionCard';
import CreateQuestionForm from './CreateQuestionForm';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import type { Question } from '@/modules/qna/qna.api';

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  const { data: questions, isLoading, isError, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await fetch('/academic/questions');
      return response.json();
    },
  });

  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        );
      case 'oldest':
        filtered.sort((a: Question, b: Question) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        );
      case 'title':
        filtered.sort((a: Question, b: Question) =>
          a.title.localeCompare(b.title);
        );
    }

    return filtered;
  }, [questions, searchTerm, tagFilter, sortBy, refetch]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach((q) => q.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [questions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Questions</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 gap-3">
            <Search className="w-full" />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-10 px-4 rounded-lg border border-input bg-background"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="h-10 px-4 rounded-lg border border-input bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No questions found"
          description={searchTerm || tagFilter
            ? searchTerm
              ? 'Try adjusting your search or filters'
              : 'Try selecting a different tag'}
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearchTerm('');
              setTagFilter('');
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} onVote={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
