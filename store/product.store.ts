import { create } from "zustand";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export interface ProductState {
  products: Product[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setProducts: (products) => set({ products }),
}));
