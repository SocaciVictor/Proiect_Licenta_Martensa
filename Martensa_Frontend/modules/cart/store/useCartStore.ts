import apiClient from "@/services/apiClient";
import { decodeJwt } from "@/utils/decodeJwt";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { CartProduct, CartResponse } from "../types/cart";

interface CartState {
  cart: CartResponse | null;
  products: CartProduct[];
  quantities: { [id: number]: number };
  total: number;
  fetchCart: () => Promise<void>;
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  products: [],
  quantities: {},
  total: 0,

  fetchCart: async () => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      if (!token) return;
      const decoded = decodeJwt(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) return;

      const res = await apiClient.get<CartResponse>("/carts/me", {
        headers: { "X-User-Email": email },
      });

      const productsList = res.data.products;

      const quantities = productsList.reduce((acc, product) => {
        acc[product.id] = Math.max(product.quantity || 1, 1);
        return acc;
      }, {} as { [id: number]: number });

      const total = productsList.reduce(
        (sum, p) => sum + (p.discountPrice || p.price) * (p.quantity || 1),
        0
      );

      set({
        cart: res.data,
        products: productsList,
        quantities,
        total,
      });
    } catch (err) {
      console.error("Eroare la fetchCart:", err);
    }
  },

  addProduct: async (productId) => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      if (!token) return;
      const decoded = decodeJwt(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) return;

      await apiClient.post(
        "/carts/add",
        { productId },
        {
          headers: { "X-User-Email": email },
        }
      );

      await get().fetchCart();
    } catch (err) {
      console.error("Eroare la addProduct:", err);
    }
  },

  removeProduct: async (productId) => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      if (!token) return;
      const decoded = decodeJwt(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) return;

      await apiClient.delete("/carts/remove", {
        headers: { "X-User-Email": email },
        data: { productId },
      });

      await get().fetchCart();
    } catch (err) {
      console.error("Eroare la removeProduct:", err);
    }
  },

  clearCart: async () => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      if (!token) return;
      const decoded = decodeJwt(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) return;

      await apiClient.delete("/carts/clear", {
        headers: { "X-User-Email": email },
      });

      await get().fetchCart();
    } catch (err) {
      console.error("Eroare la clearCart:", err);
    }
  },
}));
