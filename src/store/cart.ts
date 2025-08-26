import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  priceCents: number;
  imageUrl: string;
  qty: number;
};

type CartState = {
  items: Record<number, CartItem>;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: {},
  add: (item) =>
    set((state) => {
      const existing = state.items[item.id];
      const qty = (existing?.qty ?? 0) + 1;
      return { items: { ...state.items, [item.id]: { ...item, qty } } };
    }),
  remove: (id) =>
    set((state) => {
      const next = { ...state.items };
      delete next[id];
      return { items: next } as CartState;
    }),
  clear: () => set({ items: {} }),
}));
