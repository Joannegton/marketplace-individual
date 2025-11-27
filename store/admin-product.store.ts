import { create } from "zustand";

export type AdminProduct = {
  docId?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sellerId: string;
  createdBy: string;
};

interface AdminProductState {
  products: AdminProduct[];
  editingProduct: AdminProduct | null;
  isAdding: boolean;
  sheetOpen: boolean;
  setProducts: (products: AdminProduct[]) => void;
  setEditingProduct: (product: AdminProduct | null) => void;
  setIsAdding: (isAdding: boolean) => void;
  setSheetOpen: (open: boolean) => void;
  openAddSheet: () => void;
  openEditSheet: (product: AdminProduct) => void;
  closeSheet: () => void;
}

export const useAdminProductStore = create<AdminProductState>((set) => ({
  products: [],
  editingProduct: null,
  isAdding: false,
  sheetOpen: false,
  setProducts: (products) => set({ products }),
  setEditingProduct: (editingProduct) => set({ editingProduct }),
  setIsAdding: (isAdding) => set({ isAdding }),
  setSheetOpen: (sheetOpen) => set({ sheetOpen }),
  openAddSheet: () =>
    set({ isAdding: true, editingProduct: null, sheetOpen: true }),
  openEditSheet: (product) =>
    set({ isAdding: false, editingProduct: product, sheetOpen: true }),
  closeSheet: () =>
    set({ sheetOpen: false, isAdding: false, editingProduct: null }),
}));
