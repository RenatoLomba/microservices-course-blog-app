import { PostCreate } from './components/posts/PostCreate';
import { PostList } from './components/posts/PostList';

function App() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold my-5">Create Post</h1>
      <PostCreate />

      <hr className="my-10" />

      <h1 className="text-5xl font-bold mb-5">Posts</h1>
      <PostList />
    </div>
  );
}

export default App;
