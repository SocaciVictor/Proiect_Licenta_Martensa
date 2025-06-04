import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { create } from "zustand";

type ProductStore = {
  products: ProductResponse[];
  fetchAllProducts: () => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  fetchAllProducts: async () => {
    try {
      const res = await apiClient.get<ProductResponse[]>("/products");
      set({ products: res.data });
    } catch (err) {
      console.error("Eroare la fetch produse:", err);
    }
  },
}));
