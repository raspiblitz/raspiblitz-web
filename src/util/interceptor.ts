import axios, { AxiosRequestConfig } from 'axios';

export const instance = axios.create({ baseURL: '/api' });

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
