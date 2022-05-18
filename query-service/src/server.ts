import cors from 'cors';
import express from 'express';

import { EventTypes } from './events';

const app = express();
app.use(express.json());
app.use(cors());

interface IComment {
  id: string;
  content: string;
}

interface IPost {
  id: string;
  title: string;
  comments: IComment[];
}

interface IPostsData {
  [postId: string]: IPost;
}

const posts: IPostsData = {};

app.get('/posts', (req, res) => {
  return res.json(posts);
});

function handlePostCreated(data: IPost) {
  const { id, title } = data;

  posts[id] = { id, title, comments: [] };
}

function handleCommentCreated(data: IComment & { postId: string }) {
  const { id, content, postId } = data;

  posts[postId].comments.push({ id, content });
}

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case EventTypes.POST_CREATED:
      handlePostCreated(data);
      break;
    case EventTypes.COMMENT_CREATED:
      handleCommentCreated(data);
      break;
    default:
      break;
  }

  return res.send();
});

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
