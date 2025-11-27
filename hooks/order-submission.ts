const ORDER_SUBMITTED_KEY = "choco-order-submitted";
const CART_STORAGE_KEY = "choco-cart";

export const useOrderSubmission = () => {
  const markOrderAsSubmitted = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        ORDER_SUBMITTED_KEY,
        JSON.stringify({ submitted: true, timestamp: Date.now() })
      );

      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        try {
          const parsedCart = JSON.parse(cartData);
          localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify({
              items: parsedCart,
              enviado: true,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.error("Error marking cart as submitted:", e);
        }
      }
    }
  };

  const isOrderSubmitted = (): boolean => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(ORDER_SUBMITTED_KEY);
      if (data) {
        try {
          return JSON.parse(data).submitted === true;
        } catch (e) {
          console.error("Error checking order submission:", e);
        }
      }
    }
    return false;
  };

  const clearOrderSubmission = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ORDER_SUBMITTED_KEY);
      // Also clear cart with submitted flag
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  return {
    markOrderAsSubmitted,
    isOrderSubmitted,
    clearOrderSubmission,
  };
};
