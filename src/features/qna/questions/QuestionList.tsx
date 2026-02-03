import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';

const QuestionList = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach((q) => q.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [questions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestions(
      questions.filter((q) =>
        q.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        q.content.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleClearFilters = () => {
    setQuestions(questions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Questions</h1>
        <p className="text-sm text-muted-foreground">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-full" />
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Clear
          </button>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Ask Question</span>
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No questions found. Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question: any, idx: number) => (
            <div key={idx} className="border border-border rounded-lg bg-card p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {question.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {question.content}
              </p>
              <p className="text-xs text-muted-foreground">
                Asked {new Date(question.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{question.upvotes || 0} upvotes</span>
                <span>{question.downvotes || 0} downvotes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
