import axios from 'axios';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;

  axios
    .post('http://localhost:5000/events', event)
    .catch((error) =>
      console.error('Error emitting event to Posts Service', error),
    );

  axios
    .post('http://localhost:5001/events', event)
    .catch((error) =>
      console.error('Error emitting event to Comments Service', error),
    );

  axios
    .post('http://localhost:5002/events', event)
    .catch((error) =>
      console.error('Error emitting event to Query Service', error),
    );

  axios
    .post('http://localhost:5003/events', event)
    .catch((error) =>
      console.error('Error emitting event to Moderation Service', error),
    );

  return res.send({ status: 'OK' });
});

const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
