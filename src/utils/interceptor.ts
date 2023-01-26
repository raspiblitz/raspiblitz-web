import axios from "axios";
import { ACCESS_TOKEN } from ".";

export const instance = axios.create({ baseURL: "/api/v1" });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
