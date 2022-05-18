import { FC } from 'react';

type ICommentStatus = 'approved' | 'pending' | 'rejected';

interface IComment {
  id: string;
  content: string;
  status: ICommentStatus;
}

interface ICommentListProps {
  comments: IComment[];
}

const getCommentTextByStatus = (status: ICommentStatus, comment: string) => {
  switch (status) {
    case 'approved':
      return comment;
    case 'pending':
      return 'This comment is awaiting moderation';
    case 'rejected':
      return 'This comment has been rejected';
    default:
      return 'Comment unavailable';
  }
};

export const CommentList: FC<ICommentListProps> = ({ comments }) => {
  const commentsQty = comments.length;

  return (
    <div className="flex-1">
      <small className="mb-2 block">{commentsQty} comments</small>

      <ul className="px-2 overflow-auto max-h-24">
        {comments.map((comment) => (
          <li key={comment.id}>
            {getCommentTextByStatus(comment.status, comment.content)}
          </li>
        ))}
      </ul>
    </div>
  );
};
