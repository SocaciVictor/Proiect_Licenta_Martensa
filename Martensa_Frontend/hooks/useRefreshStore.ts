import { create } from "zustand";

interface RefreshState {
  refreshVersion: number;
  incrementRefreshVersion: () => void;
}

export const useRefreshStore = create<RefreshState>((set) => ({
  refreshVersion: 0,
  incrementRefreshVersion: () =>
    set((state) => ({ refreshVersion: state.refreshVersion + 1 })),
}));
