import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import type { Question, Answer } from '@/modules/qna/qna.api';

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  const { data: questions = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await fetch('/academic/questions');
      return response.json();
    },
  });

  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

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
    questions.forEach((q: Question) => q.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [questions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Questions</h1>
        <p className="text-sm text-muted-foreground">
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
            className="h-10 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {(searchTerm || tagFilter || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTagFilter('');
                setSortBy('newest');
              }}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Questions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border border-border rounded-lg bg-card">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-16 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={Search}
          title="Unable to load questions"
          description="There was an error loading questions. Please try again."
          action={{
            label: 'Try Again',
            onClick: () => refetch(),
          }}
        />
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No questions found"
          description={
            searchTerm || tagFilter || sortBy !== 'newest'
              ? 'Try adjusting your search or filters, or select "Newest First" to see all questions.'
              : 'Be the first to ask a question in your batch!'}
          }
          action={{
            label: 'Ask Question',
            onClick: () => setTagFilter('new'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="border border-border rounded-lg bg-card p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {question.author.firstName
                      ? question.author.firstName[0]
                      : question.author.email.split('@')[0][0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {question.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Asked {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-card-foreground">
                          {question.upvotes}
                        </span>
                        <span>upvotes</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-card-foreground">
                          {question.downvotes}
                        </span>
                        <span>downvotes</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredQuestions.length > 0 && (
        <p className="text-sm text-muted-foreground text-center pt-4">
          Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
          {searchTerm || tagFilter || sortBy !== 'newest' && (
            <span> (filtered from {questions.length} total)</span>
          )}
        </p>
      )}
    </div>
  );
};

export default QuestionList;
