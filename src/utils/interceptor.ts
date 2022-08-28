import axios, { AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN } from ".";

export const instance = axios.create({ baseURL: "/api/v1" });

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
