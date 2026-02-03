import { useState } from 'react';

const CreateQuestionForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Submit to API when ready
    console.log('Creating question:', { title, content, tags });

    // Simulate success
    setTimeout(() => {
      setTitle('');
      setContent('');
      setTags([]);
      setIsSubmitting(false);
    }, 500);

    if (isSubmitting) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    return (
      <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Create Question</h2>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Post Question'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setContent('');
                setTags([]);
              }}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              {isSubmitting ? 'Cancel' : 'Clear'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestionForm;
