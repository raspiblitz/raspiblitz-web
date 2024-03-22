import axios from "axios";
import { ACCESS_TOKEN } from "./index";

export const instance = axios.create({ baseURL: "/api" });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
