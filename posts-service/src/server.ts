import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

import { emitEvent } from './services/event-bus';

const app = express();

app.use(express.json());
app.use(cors());

interface IPost {
  id: string;
  title: string;
}

interface IPostRepository {
  [key: string]: IPost;
}

const posts: IPostRepository = {};

app.get('/posts', (_, res) => {
  return res.json(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await emitEvent({
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  return res.status(201).json(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  return res.send();
});

const port = 5000;
const apiVersion = process.env.API_VERSION || '0.0.1';

app.listen(port, () => {
  console.log(`Posts service ${apiVersion}`);
  console.log(`Server is running on port ${port}...`);
});
