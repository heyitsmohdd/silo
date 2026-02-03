import { useState } from 'react';

interface CreateQuestionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateQuestionForm = ({ onSuccess, onCancel }: CreateQuestionFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log('Creating question:', { title, content, tags });
    setTitle('');
    setContent('');
    setTags([]);
    onSuccess();
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Ask a Question</h2>
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
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to know?"
            required
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
            Question
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide more details about your question..."
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(', '))}
            placeholder="e.g., exam, homework"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Post Question
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

export default CreateQuestionForm;
