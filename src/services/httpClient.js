import axios from "axios";

import { getStoredToken } from "../features/auth/utils/authStorage.js";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

const baseURL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : undefined;

export const isApiConfigured = Boolean(baseURL);

export const httpClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
