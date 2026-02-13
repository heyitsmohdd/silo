import { useState } from 'react';
import AnswerCard from './AnswerCard';
import AnswerForm from './AnswerForm';

interface CommentThreadProps {
    answer: any;
    allAnswers: any[];
    questionId: string;
    questionAuthorId: string;
    bestAnswerId: string | null;
    onUpdate: () => void;
    depth?: number;
}

const CommentThread = ({
    answer,
    allAnswers,
    questionId,
    questionAuthorId,
    bestAnswerId,
    onUpdate,
    depth = 0,
}: CommentThreadProps) => {
    const [isReplying, setIsReplying] = useState(false);

    // Find children
    const children = allAnswers
        .filter((a) => a.parentId === answer.id)
        .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className={`flex flex-col ${depth > 0 ? 'ml-8 border-l-2 border-zinc-800 pl-4' : ''}`}>
            {/* The Comment Itself */}
            <AnswerCard
                answer={answer}
                questionId={questionId}
                questionAuthorId={questionAuthorId}
                isBest={answer.id === bestAnswerId}
                onUpdate={onUpdate}
                onReply={() => setIsReplying(!isReplying)}
                isLast={children.length === 0 && !isReplying} // Only visually "last" if no children
            />

            {/* Reply Form */}
            {isReplying && (
                <div className="mb-4">
                    <AnswerForm
                        questionId={questionId}
                        onSuccess={() => {
                            setIsReplying(false);
                            onUpdate();
                        }}
                        parentId={answer.id}
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}

            {/* Children (Recursive) */}
            {children.length > 0 && (
                <div className="space-y-2">
                    {children.map((child) => (
                        <CommentThread
                            key={child.id}
                            answer={child}
                            allAnswers={allAnswers}
                            questionId={questionId}
                            questionAuthorId={questionAuthorId}
                            bestAnswerId={bestAnswerId}
                            onUpdate={onUpdate}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentThread;
