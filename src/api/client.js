import axios from 'axios';
import { getToken } from '../utils/auth.js';

const client = axios.create({
  baseURL: '/api'
});

client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
