import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Must match Flask port
});

export default api;