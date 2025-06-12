import { useRefreshStore } from "@/hooks/useRefreshStore";
import * as authService from "@/modules/auth/services/authService";
import {
  LoginRequest,
  RegisterRequest,
  UserProfileResponse,
} from "@/modules/auth/types/auth";
import { useOrderStore } from "@/modules/orders/store/useOrderStore";
import apiClient from "@/services/apiClient";
import { decodeJwt } from "@/utils/decodeJwt";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const TOKEN_KEY = "my-jwt";

interface AuthState {
  token: string | null;
  authenticated: boolean;
  user: UserProfileResponse | null;
  email: string | null;
  userId: number | null;
  setUser: (userId: UserProfileResponse | null) => void;
  setUserId: (userId: number | null) => void;
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
  userId: null,
  user: null,

  setEmail: (email) => set({ email }),
  setUserId: (userId) => set({ userId }),
  setUser: (user) => set({ user }),

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ token, authenticated: !!token });

      if (token) {
        try {
          await authService.validateToken(token);

          const decoded = decodeJwt(token);
          const email = decoded?.email || decoded?.sub || null;

          set({ email });

          if (email) {
            try {
              const userResponse = await apiClient.get("/users/me", {
                headers: { "X-User-Email": email },
              });
              const userId = userResponse.data.id;
              const user = userResponse.data;

              set({ userId });
              set({ user });
            } catch (err) {
              console.error("Eroare la fetch userId:", err);
              set({ userId: null });
            }
          }
        } catch (validateErr) {
          console.warn("Token invalid, se face logout...");
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          set({ token: null, authenticated: false, email: null, userId: null });
        }
      }
    } catch (err) {
      console.error("Eroare la initAuth:", err);
    }
  },

  login: async (data) => {
    try {
      const response = await authService.login(data);

      // 1️⃣ salvezi token-ul
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);

      // 2️⃣ setezi token provizoriu ca să fie disponibil în store (dacă vrei să arăți ceva imediat)
      set({ token: response.token, authenticated: true });

      // 3️⃣ initAuth → face validare + setează email, user, userId etc.
      await useAuthStore.getState().initAuth();
      useRefreshStore.getState().incrementRefreshVersion();

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

      set({ token: response.token, authenticated: true });

      await useAuthStore.getState().initAuth();

      useRefreshStore.getState().incrementRefreshVersion();

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

      // Reset state
      set({
        token: null,
        authenticated: false,
        email: null,
        userId: null,
        user: null,
      });

      useOrderStore.getState().clearOrders();
      // Fac din nou initAuth pentru a forța refresh pe componente
      await useAuthStore.getState().initAuth();
      useRefreshStore.getState().incrementRefreshVersion();
    } catch (err) {
      console.error("Eroare la logout:", err);
    }
  },
}));
