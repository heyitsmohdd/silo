import { useState } from 'react';
import { Send } from 'lucide-react';

interface AnswerFormProps {
  questionId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AnswerForm = ({ questionId, onSuccess, onCancel }: AnswerFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    // TODO: Submit to API
    console.log('Creating answer:', { content });
    setContent('');
    onSuccess();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Answer Question</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
            Your Answer
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide your answer..."
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <Send className="w-4 h-4" />
            <span>Submit Answer</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
