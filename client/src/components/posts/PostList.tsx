import { FC, useEffect, useState } from 'react';

import { queryService } from '../../lib/axios/queryService';
import { CommentCreate } from './comments/CommentCreate';
import { CommentList } from './comments/CommentList';

interface IComment {
  id: string;
  content: string;
}

interface IPost {
  id: string;
  title: string;
  comments: IComment[];
}

interface IPostListData {
  [id: string]: IPost;
}

export const PostList: FC = () => {
  const [posts, setPosts] = useState<IPostListData>();

  const fetchPosts = async () => {
    const { data } = await queryService.get<IPostListData>('/posts');

    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const postsToRender = posts ? Object.values(posts) : [];

  return (
    <div className="flex gap-5 flex-wrap">
      {postsToRender.map((post) => (
        <div
          key={post.id}
          className="flex-1 max-w-[30%] h-64 bg-blue-50 border-2 border-blue-100 p-4"
        >
          <div className="h-[100%] w-[100%] flex flex-col justify-between">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <CommentList comments={post.comments} />
            <CommentCreate postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
