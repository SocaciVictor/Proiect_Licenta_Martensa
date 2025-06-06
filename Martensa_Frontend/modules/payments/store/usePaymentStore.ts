import { create } from "zustand";

interface PaymentState {
  lastOrderId: number | null;
  setLastOrderId: (id: number) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  lastOrderId: null,
  setLastOrderId: (id) => set({ lastOrderId: id }),
}));
