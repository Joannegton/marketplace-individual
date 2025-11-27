"use client";

import CartCard from "@/components/shop/CartCard";
import DeliveryCard from "@/components/shop/DeliveryCard";
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = Product & { quantity: number };

type Props = {
  cart: CartItem[];
  total: number;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  formData: any;
  setFormData: (d: any) => void;
  showPix: boolean;
  setShowPix: (v: boolean) => void;
  showEditPhone: boolean;
  setShowEditPhone: (v: boolean) => void;
  finalizeOrder: () => Promise<void>;
  validateOrder: () => void;
  isProcessing: boolean;
  PIX_NUMBER?: string;
  onClose: () => void;
  sellerWhatsApp?: string;
};

export default function CheckoutPanel(props: Readonly<Props>) {
  const {
    cart,
    total,
    updateQuantity,
    removeFromCart,
    formData,
    setFormData,
    showPix,
    setShowPix,
    showEditPhone,
    setShowEditPhone,
    finalizeOrder,
    validateOrder,
    isProcessing,
    PIX_NUMBER,
    onClose,
  } = props;
  return (
    <div className="max-w-4xl mx-auto">
      <Button
        onClick={onClose}
        variant="ghost"
        className="mb-2 text-amber-900 touch-manipulation min-h-11 p-0"
      >
        ← Voltar aos produtos
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <CartCard
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          total={total}
        />

        {cart.length > 0 && (
          <DeliveryCard
            cart={cart}
            formData={formData}
            setFormData={setFormData}
            showPix={showPix}
            setShowPix={setShowPix}
            showEditPhone={showEditPhone}
            setShowEditPhone={setShowEditPhone}
            finalizeOrder={finalizeOrder}
            validateOrder={validateOrder}
            isProcessing={isProcessing}
            PIX_NUMBER={PIX_NUMBER}
          />
        )}
      </div>
    </div>
  );
}
