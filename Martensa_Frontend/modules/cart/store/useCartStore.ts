import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { CartProduct, CartResponse } from "@/modules/cart/types/cart";
import apiClient from "@/services/apiClient";
import { create } from "zustand";

interface CartState {
  cart: CartResponse | null;
  quantities: { [id: number]: number };
  products: CartProduct[];
  total: number;
  fetchCart: () => Promise<void>;
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  quantities: {},
  products: [],
  total: 0,

  fetchCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const email = decoded?.email || decoded?.sub;
    if (!email) return;

    const res = await apiClient.get<CartResponse>("/carts/me", {
      headers: { "X-User-Email": email },
    });

    const countMap: { [id: number]: number } = {};
    for (const p of res.data.products) {
      countMap[p.id] = (countMap[p.id] || 0) + 1;
    }

    const uniqueProducts = Object.values(
      res.data.products.reduce((acc, p) => {
        if (!acc[p.id]) acc[p.id] = p;
        return acc;
      }, {} as { [id: number]: CartProduct })
    );

    const total = res.data.products.reduce(
      (acc, p) => acc + (p.discountPrice || p.price),
      0
    );

    set({
      cart: res.data,
      quantities: countMap,
      products: uniqueProducts,
      total,
    });
  },

  addProduct: async (productId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const email = decoded?.email || decoded?.sub;
    if (!email) return;

    await apiClient.post(
      "/carts/add",
      { productId },
      { headers: { "X-User-Email": email } }
    );

    await get().fetchCart();
  },

  removeProduct: async (productId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const email = decoded?.email || decoded?.sub;
    if (!email) return;

    await apiClient.delete("/carts/remove", {
      headers: { "X-User-Email": email },
      data: { productId },
    });

    await get().fetchCart();
  },

  clearCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const email = decoded?.email || decoded?.sub;
    if (!email) return;

    await apiClient.delete("/carts/clear", {
      headers: { "X-User-Email": email },
    });

    await get().fetchCart();
  },
}));
