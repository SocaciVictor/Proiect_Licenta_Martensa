// services/apiClient.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiClient = axios.create({
  baseURL: "http://192.168.1.134:8090",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("my-jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
