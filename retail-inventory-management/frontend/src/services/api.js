import axios from 'axios';
import { resolveFallbackResponse } from './fallbackData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rim_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (!config || error.response) {
      return Promise.reject(error);
    }

    const fallbackResponse = await resolveFallbackResponse(config.method, config.url, config.data);
    if (fallbackResponse) {
      return fallbackResponse;
    }

    return Promise.reject(error);
  },
);

export default api;
