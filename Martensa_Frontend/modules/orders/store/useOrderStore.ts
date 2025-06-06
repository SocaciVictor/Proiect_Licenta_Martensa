import apiClient from "@/services/apiClient";
import { create } from "zustand";
import { OrderResponse } from "../types/orderTypes";

interface OrderState {
  orders: OrderResponse[];
  fetchOrdersByUserId: (userId: number) => Promise<void>;
  loading: boolean;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,

  fetchOrdersByUserId: async (userId) => {
    set({ loading: true });
    try {
      const response = await apiClient.get<OrderResponse[]>(
        `/orders/user/${userId}`
      );
      set({ orders: response.data });
    } catch (error) {
      console.error("Eroare la fetch orders:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
