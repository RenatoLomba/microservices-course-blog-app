import cors from 'cors';
import express from 'express';

import { EventTypes } from './events';
import { getEvents } from './services/event-bus';

const app = express();
app.use(express.json());
app.use(cors());

interface IComment {
  id: string;
  content: string;
  status: string;
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

app.get('/posts', (_, res) => {
  return res.json(posts);
});

function handlePostCreated(data: IPost) {
  const { id, title } = data;

  posts[id] = { id, title, comments: [] };
}

function handleCommentCreated(data: IComment & { postId: string }) {
  const { id, content, postId, status } = data;

  posts[postId].comments.push({ id, content, status });
}

function handleCommentUpdated(data: IComment & { postId: string }) {
  const { content, id, postId, status } = data;

  const post = posts[postId];
  const comment = post.comments.find((cm) => cm.id === id);

  if (!comment) return;

  comment.status = status;
  comment.content = content;
}

function handleEvent(type: string, data: unknown) {
  switch (type) {
    case EventTypes.POST_CREATED:
      handlePostCreated(data as IPost);
      break;
    case EventTypes.COMMENT_CREATED:
      handleCommentCreated(data as IComment & { postId: string });
      break;
    case EventTypes.COMMENT_UPDATED:
      handleCommentUpdated(data as IComment & { postId: string });
      break;
    default:
      break;
  }
}

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  return res.send();
});

const port = process.env.PORT || 5002;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}...`);

  const events = await getEvents();

  events?.forEach((event) => {
    console.log('Processing event: ', event.type);

    handleEvent(event.type, event.data);
  });
});
