import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

import { emitEvent } from './services/event-bus';

const app = express();

app.use(express.json());
app.use(cors());

interface IComment {
  id: string;
  content: string;
}

interface ICommentsByPostIdRepository {
  [postId: string]: IComment[];
}

const commentsByPostId: ICommentsByPostIdRepository = {};

app.get('/posts/:id/comments', (req, res) => {
  const { id: postId } = req.params;

  const comments = commentsByPostId[postId] || [];

  return res.json(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const { id: postId } = req.params;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[postId] = comments;

  await emitEvent({
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId,
    },
  });

  return res.status(201).json(comments);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  return res.send();
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
