import axios from 'axios';

const postsService = axios.create({
  baseURL: 'http://posts.com',
});

export { postsService };
