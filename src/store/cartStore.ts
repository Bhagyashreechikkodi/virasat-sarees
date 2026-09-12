"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BlouseOption, Saree } from "@/data/sarees";

export interface CartItem {
  saree: Saree;
  quantity: number;
  blouseOption: BlouseOption;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (saree: Saree, blouseOption?: BlouseOption) => void;
  removeItem: (id: string, blouseOption: BlouseOption) => void;
  updateQuantity: (
    id: string,
    blouseOption: BlouseOption,
    quantity: number
  ) => void;
  clearCart: () => void;
}

export const FREE_SHIPPING_THRESHOLD = 600;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (saree, blouseOption = "Unstitched") => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.saree.id === saree.id && i.blouseOption === blouseOption
          );
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.saree.id === saree.id && i.blouseOption === blouseOption
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            isOpen: true,
            items: [...state.items, { saree, quantity: 1, blouseOption }],
          };
        });
      },
      removeItem: (id, blouseOption) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.saree.id === id && i.blouseOption === blouseOption)
          ),
        })),
      updateQuantity: (id, blouseOption, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.saree.id === id && i.blouseOption === blouseOption)
                )
              : state.items.map((i) =>
                  i.saree.id === id && i.blouseOption === blouseOption
                    ? { ...i, quantity }
                    : i
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "royal-silks-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
