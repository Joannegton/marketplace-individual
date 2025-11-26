import { create } from "zustand";

interface FormData {
  name: string;
  location: string;
  deliveryMethod: string;
  whatsapp: string;
  cpf: string;
}

interface UIState {
  showCheckout: boolean;
  setShowCheckout: (v: boolean) => void;
  formData: FormData;
  setFormData: (d: Partial<FormData>) => void;
  showPix: boolean;
  setShowPix: (v: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  showEditPhone: boolean;
  setShowEditPhone: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showCheckout: false,
  setShowCheckout: (v) => set({ showCheckout: v }),
  formData: {
    name: "",
    location: "",
    deliveryMethod: "retirar",
    whatsapp: "",
    cpf: "",
  },
  setFormData: (d) => set((s) => ({ formData: { ...s.formData, ...d } })),
  showPix: false,
  setShowPix: (v) => set({ showPix: v }),
  isProcessing: false,
  setIsProcessing: (v) => set({ isProcessing: v }),
  showEditPhone: false,
  setShowEditPhone: (v) => set({ showEditPhone: v }),
}));
