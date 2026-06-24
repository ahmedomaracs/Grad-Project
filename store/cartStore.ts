'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../types/shop';

interface CartStore {
  cartItems: CartItem[];
  isOpen: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.cartItems.find(
            (i) => String(i.product.id) === String(product.id)
          );
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                String(i.product.id) === String(product.id)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (i) => String(i.product.id) !== String(productId)
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            String(i.product.id) === String(productId)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().cartItems.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),
    }),
    {
      name: 'automate-shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist cartItems — not drawer open state
      partialize: (state) => ({ cartItems: state.cartItems }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
