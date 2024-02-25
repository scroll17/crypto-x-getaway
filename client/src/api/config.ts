import axios from 'axios';

const BASE_URL = process.env.BASE_API_URL;

// Axios instance and default configuration
export const baseApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
