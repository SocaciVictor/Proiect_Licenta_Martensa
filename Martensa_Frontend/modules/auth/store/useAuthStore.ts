import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { User } from "../services/authService"; // Import the User type from authService.ts

// Define the shape of the authentication store state
interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Create a secure storage adapter for Zustand (using expo-secure-store)
const secureStorage: StateStorage = {
  // Retrieve an item from secure storage (returns the raw string or null if not found)
  getItem: async (key: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(key);
    return value ?? null;
  },
  // Save an item to secure storage (value should be a string)
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  // Remove an item from secure storage
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

// Create the Zustand store with persistence using the secure storage
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isLoggedIn: false,

      // Method to set authentication data after login
      setAuth: (token: string, user: User) => {
        // Store token and user, and mark as logged in
        set({ token, user, isLoggedIn: true });
      },

      // Method to clear authentication data on logout
      logout: () => {
        // Clear token and user, and mark as logged out
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth", // storage key name for expo-secure-store
      storage: createJSONStorage(() => secureStorage), // persist using secureStorage adapter
    }
  )
);
