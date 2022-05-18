import axios from 'axios';

export const queryService = axios.create({
  baseURL: 'http://localhost:5002',
});
