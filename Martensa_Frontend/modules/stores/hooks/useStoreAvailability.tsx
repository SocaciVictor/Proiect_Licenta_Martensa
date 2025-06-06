import apiClient from "@/services/apiClient";
import { create } from "zustand";
import { StoreResponse } from "../types/storeTypes";

interface StoreState {
  stores: StoreResponse[];
  loading: boolean;
  fetchStores: () => Promise<void>;
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  loading: false,

  fetchStores: async () => {
    set({ loading: true });
    try {
      const response = await apiClient.get<StoreResponse[]>("/stores");
      set({ stores: response.data });
    } catch (error) {
      console.error("Eroare la fetch stores:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
