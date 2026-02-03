import { Search, Clock, User, ThumbsUp, ThumbsDown } from 'lucide-react';

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    upvotes: number;
    downvotes: number;
    createdAt: string;
    author: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
    answers: {
      id: string;
      content: string;
      authorId: string;
      createdAt: string;
      upvotes: number;
      downvotes: number;
    }[];
    bestAnswerId: string | null;
  };
  onVote: (questionId: string, voteType: 'upvote' | 'downvote') => void;
}

const QuestionCard = ({ question, onVote }: QuestionCardProps) => {
  const [hasVotedUp, setHasVotedUp] = useState(false);
  const [hasVotedDown, setHasVotedDown] = useState(false);

  const handleVote = (type: 'upvote' | 'downvote') => {
    if (type === 'upvote') {
      if (hasVotedUp) return;
      setHasVotedUp(true);
    } else {
      if (hasVotedDown) return;
      setHasVotedDown(true);
    }
    onVote(question.id, type);
  };

  const getInitials = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return initials;
  };

  const getAvatarGradient = (email: string) => {
    const hash = email.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    const hue = Math.abs(hash % 360);
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="border border-border rounded-lg bg-card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          style={{ background: getAvatarGradient(question.author.email) }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
        >
          {getInitials(question.author.firstName || question.author.email)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="text-sm font-semibold text-foreground">
              {question.author.firstName
                ? question.author.firstName
                : question.author.email.split('@')[0][0].toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground">
              {question.author.firstName
                ? question.author.lastName
                  ? question.author.lastName
                  : ''}
            </p>
          </div>

          <div className="mb-2">
            <h3 className="font-semibold text-lg text-foreground leading-tight">
              {question.title}
            </h3>
          </div>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {question.content}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Asked {formatTime(question.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span>{question.upvotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <span>{question.downvotes}</span>
            </div>
          </div>

          {/* Answers */}
          {question.answers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
              </h4>

              <div className="space-y-3">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        style={{ background: getAvatarGradient(answer.author.email) }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                      >
                        {getInitials(answer.author.firstName || answer.author.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {answer.author.firstName
                            ? answer.author.firstName
                            : answer.author.email.split('@')[0][0].toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Answered {formatTime(answer.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-card-foreground">
                        {answer.upvotes}
                      </span>
                      <span>upvotes</span>
                    </div>

                    {answer.id === question.bestAnswerId && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-yellow-900 text-xs font-medium">
                        Best Answer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-border flex gap-2">
            <button
              onClick={() => handleVote('upvote')}
              className={`flex-1 items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                hasVotedUp
                  ? 'border-border bg-muted opacity-50 cursor-not-allowed'
                  : 'border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary hover:ring-2 hover:ring-primary/30'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Upvote</span>
            </button>
            <button
              onClick={() => handleVote('downvote')}
              className={`flex-1 items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                hasVotedDown
                  ? 'border-border bg-muted opacity-50 cursor-not-allowed'
                  : 'border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary hover:ring-2 hover:ring-primary/30'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Downvote</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
