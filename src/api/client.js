import axios from 'axios';
import { getToken } from '../utils/auth.js';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export default client;
