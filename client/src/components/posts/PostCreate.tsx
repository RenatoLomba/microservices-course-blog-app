import { FC, FormEvent, useState } from 'react';

import { postsService } from '../../lib/axios/postsService';

export const PostCreate: FC = () => {
  const [title, setTitle] = useState('');

  const canSubmitForm = !!title.trim();

  const onCreatePostSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmitForm) return;

    await postsService.post('/posts/create', {
      title: title.trim(),
    });

    setTitle('');
  };

  return (
    <div>
      <form className="flex flex-col gap-5" onSubmit={onCreatePostSubmit}>
        <div className="flex flex-col">
          <label className="font-medium text-xl">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-100 w-96 h-10 px-3 border-2 rounded-md"
            type="text"
          />
        </div>
        <button
          disabled={!canSubmitForm}
          className="w-32 h-10 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
