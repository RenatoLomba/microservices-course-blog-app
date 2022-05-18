import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

import { EventTypes } from './events';
import { emitEvent } from './services/event-bus';

const app = express();

app.use(express.json());
app.use(cors());

type ICommentStatus = 'pending' | 'approved' | 'rejected';

interface IComment {
  id: string;
  content: string;
  status: ICommentStatus;
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

  const newComment: IComment = { id: commentId, content, status: 'pending' };

  comments.push(newComment);

  commentsByPostId[postId] = comments;

  await emitEvent({
    type: 'CommentCreated',
    data: {
      id: newComment.id,
      content: newComment.content,
      status: newComment.status,
      postId,
    },
  });

  return res.status(201).json(comments);
});

interface ICommentModeratedData {
  id: string;
  postId: string;
  content: string;
  status: 'approved' | 'rejected';
}

const handleCommentModerated = async (data: ICommentModeratedData) => {
  const { postId, id, status } = data;

  const comments = commentsByPostId[postId];

  const comment = comments.find((cm) => cm.id === id);

  if (!comment) return;

  comment.status = status;

  await emitEvent({
    type: 'CommentUpdated',
    data: {
      postId,
      id: comment.id,
      content: comment.content,
      status: comment.status,
    },
  });
};

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case EventTypes.COMMENT_MODERATED:
      await handleCommentModerated(data);
      break;
    default:
      break;
  }

  return res.send();
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
