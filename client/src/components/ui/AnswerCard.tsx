interface AnswerProps {
  answer: {
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
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          <div className="text-2xl">
            {answer.author.firstName
              ? answer.author.firstName[0]
              : answer.author.email.split('@')[0][0].toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">
            {answer.author.firstName
              ? `${answer.author.firstName} ${answer.author.lastName}`
              : answer.author.email}
          </h3>

          <div className="mb-2">
            <p className="text-xs text-muted-foreground">
              Answered {new Date(answer.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{answer.votes.upvotes || 0} upvotes</span>
            <span>{answer.votes.downvotes || 0} downvotes</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 items-center gap-2 px-4 py-2 rounded-lg border border-green-200 bg-green-500 hover:bg-green-300 text-white transition-colors">
            <span>Upvote</span>
          </button>

          <button className="flex-1 items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-500 hover:bg-red-300 text-white transition-colors">
            <span>Downvote</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
