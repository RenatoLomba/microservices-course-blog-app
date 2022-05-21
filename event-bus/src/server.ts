import axios from 'axios';
import express from 'express';

const app = express();
app.use(express.json());

interface IEvent {
  type: string;
  data: unknown;
}

const events: IEvent[] = [];

app.post('/events', (req, res) => {
  const event = req.body as IEvent;

  events.push(event);

  axios
    .post('http://posts-clusterip-srv:5000/events', event)
    .catch((error) =>
      console.error('Error emitting event to Posts Service', error),
    );

  axios
    .post('http://comments-clusterip-srv:5001/events', event)
    .catch((error) =>
      console.error('Error emitting event to Comments Service', error),
    );

  axios
    .post('http://query-clusterip-srv:5002/events', event)
    .catch((error) =>
      console.error('Error emitting event to Query Service', error),
    );

  axios
    .post('http://moderation-clusterip-srv:5003/events', event)
    .catch((error) =>
      console.error('Error emitting event to Moderation Service', error),
    );

  return res.send({ status: 'OK' });
});

app.get('/events', (_, res) => {
  return res.send(events);
});

const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
