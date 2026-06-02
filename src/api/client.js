import axios from 'axios';

// const baseURL = "http://localhost:5000";
const baseURL = "https://agent-handler-server.onrender.com";


const client = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true
});

export default client;
