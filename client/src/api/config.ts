import axios from 'axios';

const BASE_URL = 'http://localhost:4040';

// Axios instance and default configuration
export const baseApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
