import { FC, FormEvent, useState } from 'react';

import { postsService } from '../../../lib/axios/postsService';

interface ICommentCreateProps {
  postId: string;
}

export const CommentCreate: FC<ICommentCreateProps> = ({ postId }) => {
  const [content, setContent] = useState('');

  const canSubmitForm = !!content.trim();

  const onCreateCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmitForm) return;

    await postsService.post(`/posts/${postId}/comments`, {
      content: content.trim(),
    });

    setContent('');
  };

  return (
    <div>
      <form className="flex items-end gap-3" onSubmit={onCreateCommentSubmit}>
        <div className="flex-1">
          <label className="font-medium mb-2 block">New Comment</label>
          <input
            className="h-8 border-2 border-slate-200 rounded-md px-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
          />
        </div>
        <button
          disabled={!canSubmitForm}
          type="submit"
          className="flex-1 h-8 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
