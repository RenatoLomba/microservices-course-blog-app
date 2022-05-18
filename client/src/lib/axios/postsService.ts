import axios from 'axios';

const postsService = axios.create({
  baseURL: 'http://localhost:5000',
});

export { postsService };
