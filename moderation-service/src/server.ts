import express from 'express';

import { forbiddenWords } from './domain/forbidden-words';
import { EventTypes } from './events';
import { emitEvent } from './services/event-bus';

const app = express();
app.use(express.json());

type ICommentModerationStatus = 'approved' | 'rejected';

interface ICommentCreatedData {
  id: string;
  content: string;
  status: string;
  postId: string;
}

const handleModerateComment = async (data: ICommentCreatedData) => {
  const { content } = data;

  let isApproved = true;

  forbiddenWords.forEach((fb) => {
    const includesForbiddenWord = content.includes(fb);

    isApproved = !includesForbiddenWord;
  });

  const status: ICommentModerationStatus = isApproved ? 'approved' : 'rejected';

  await emitEvent({
    type: 'CommentModerated',
    data: {
      id: data.id,
      postId: data.postId,
      status,
      content,
    },
  });
};

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case EventTypes.COMMENT_CREATED:
      await handleModerateComment(data);
      break;
    default:
      break;
  }

  return res.send();
});

const port = 5003;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
