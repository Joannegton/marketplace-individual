import { useEffect, useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useShallow } from "zustand/react/shallow";

export const useCart = () => {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
  } = useCartStore(
    useShallow((s) => ({
      cart: s.cart,
      addToCart: s.addToCart,
      updateQuantity: s.updateQuantity,
      removeFromCart: s.removeFromCart,
      clearCart: s.clearCart,
      loadCart: s.loadCart,
    }))
  );

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );
  const count = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    count,
  };
};
