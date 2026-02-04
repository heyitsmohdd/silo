import { ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from '@/components/ui/Button';

interface AnswerProps {
  id: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  votes: {
    upvotes: number;
    downvotes: number;
  };
}

const AnswerCard = ({ answer }: AnswerProps) => {
  return (
    <div className="border border-border rounded-lg bg-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          <span className="text-white text-lg">
            {answer.author.firstName ? answer.author.firstName[0] : answer.email.split('@')[0][0].toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {answer.author.firstName && answer.author.lastName ? `${answer.author.firstName} ${answer.author.lastName}` : answer.author.email.split('@')[0]}
            </h3>

            <p className="text-xs text-muted-foreground">
              Answered by {new Date(answer.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2 text-sm text-muted-foreground">
            <span className="font-medium">
              {answer.votes.upvotes || 0}
            </span>
            <span>upvotes</span>
            <span className="font-medium">
              {answer.votes.downvotes || 0}
            </span>
            <span>downvotes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
