// modules/auth/services/authService.ts
import apiClient from "../../../services/apiClient";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const validateToken = async (token: string) => {
  return await apiClient.post("/auth/validate", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
