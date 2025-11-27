import { create } from "zustand";
import { User } from "firebase/auth";
import { Seller } from "@/hooks/sellers";

interface AuthState {
  user: User | null;
  seller: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSeller: (seller: Seller | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  seller: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSeller: (seller) => set({ seller }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, seller: null, isAuthenticated: false }),
}));
