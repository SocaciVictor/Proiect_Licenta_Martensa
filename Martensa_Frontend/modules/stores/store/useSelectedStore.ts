import { create } from "zustand";

interface SelectedStoreState {
  selectedStoreId: number | null;
  selectedStoreName: string | null;
  setSelectedStore: (id: number, name: string) => void;
  clearSelectedStore: () => void;
}

export const useSelectedStore = create<SelectedStoreState>((set) => ({
  selectedStoreId: null,
  selectedStoreName: null,
  setSelectedStore: (id, name) =>
    set({ selectedStoreId: id, selectedStoreName: name }),
  clearSelectedStore: () =>
    set({ selectedStoreId: null, selectedStoreName: null }),
}));
