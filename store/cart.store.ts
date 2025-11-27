import { create } from "zustand";
import { Product } from "@/components/shop/types";

export type CartItem = Product & { quantity: number };

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  loadCart: () => boolean;
}

const CART_STORAGE_KEY = "choco-cart";

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  loadCart: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);

          if (data.items && data.enviado === true) {
            set({ cart: data.items });
            return true;
          }

          if (Array.isArray(data)) {
            set({ cart: data });
          }
        } catch (e) {
          console.error("Error loading cart:", e);
        }
      }
    }
    return false;
  },

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((c) => c.id === product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      }
      return { cart: newCart };
    }),

  updateQuantity: (id, delta) =>
    set((state) => {
      const newCart = state.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      }
      return { cart: newCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      }
      return { cart: newCart };
    }),

  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    set({ cart: [] });
  },
}));
