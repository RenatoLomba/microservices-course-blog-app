import { FC } from 'react';

interface IComment {
  id: string;
  content: string;
}

interface ICommentListProps {
  comments: IComment[];
}

export const CommentList: FC<ICommentListProps> = ({ comments }) => {
  const commentsQty = comments.length;

  return (
    <div className="flex-1">
      <small className="mb-2 block">{commentsQty} comments</small>

      <ul className="px-2 overflow-auto max-h-24">
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};
