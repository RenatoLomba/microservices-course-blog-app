import axios from 'axios';

export const commentsService = axios.create({
  baseURL: 'http://localhost:5001',
});
