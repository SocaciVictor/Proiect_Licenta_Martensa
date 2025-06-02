import * as authService from "@/modules/auth/services/authService";
import { LoginRequest, RegisterRequest } from "@/modules/auth/types/auth";
import { decodeJwt } from "@/utils/decodeJwt";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const TOKEN_KEY = "my-jwt";

interface AuthState {
  token: string | null;
  authenticated: boolean;
  email: string | null;
  setEmail: (email: string | null) => void;
  login: (data: LoginRequest) => Promise<any>;
  register: (data: RegisterRequest) => Promise<any>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  authenticated: false,
  email: null,

  setEmail: (email) => set({ email }),

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ token, authenticated: !!token });

      if (token) {
        const decoded = decodeJwt(token);
        const email = decoded?.email || decoded?.sub || null;
        set({ email });
      }
    } catch (err) {
      console.error("Eroare la initAuth:", err);
    }
  },

  login: async (data) => {
    try {
      const response = await authService.login(data);
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      const decoded = decodeJwt(response.token);
      const email = decoded?.email || decoded?.sub || null;

      set({ token: response.token, authenticated: true, email });
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
      const response = await authService.register(data);
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      const decoded = decodeJwt(response.token);
      const email = decoded?.email || decoded?.sub || null;

      set({ token: response.token, authenticated: true, email });
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
      set({ token: null, authenticated: false, email: null });
    } catch (err) {
      console.error("Eroare la logout:", err);
    }
  },
}));
