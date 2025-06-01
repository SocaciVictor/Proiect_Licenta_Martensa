import * as authService from "@/modules/auth/services/authService";
import { LoginRequest, RegisterRequest } from "@/modules/auth/types/auth";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const TOKEN_KEY = "my-jwt";

interface AuthState {
  token: string | null;
  authenticated: boolean;
  login: (data: LoginRequest) => Promise<any>;
  register: (data: RegisterRequest) => Promise<any>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  authenticated: false,

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Loaded token from SecureStore:", token);
      set({ token, authenticated: !!token });
    } catch (err) {
      console.error("Eroare la initAuth:", err);
    }
  },

  login: async (data) => {
    try {
      const response = await authService.login(data);
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      set({ token: response.token, authenticated: true });
      return response;
    } catch (e: any) {
      return {
        error: true,
        msg: e?.response?.data?.msg || "Eroare la autentificare",
      };
    }
  },

  register: async (data) => {
    try {
      const response = await authService.register(data); // trimite toate câmpurile necesare
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      set({ token: response.token, authenticated: true });
      return response;
    } catch (e: any) {
      return {
        error: true,
        msg: e?.response?.data?.msg || "Eroare la înregistrare",
      };
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set({ token: null, authenticated: false });
    } catch (err) {
      console.error("Eroare la logout:", err);
    }
  },
}));
