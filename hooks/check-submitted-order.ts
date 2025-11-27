import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const CART_STORAGE_KEY = "choco-cart";

export const useCheckSubmittedOrder = () => {
  const router = useRouter();
  const params = useParams();
  const sellerSlug = params?.sellerSlug as string;

  useEffect(() => {
    if (typeof window !== "undefined" && sellerSlug) {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        try {
          const data = JSON.parse(cartData);
          if (data.items && data.enviado === true) {
            router.push(`/${sellerSlug}/sucesso`);
          }
        } catch (e) {
          console.error("Error checking submitted order:", e);
        }
      }
    }
  }, [sellerSlug, router]);
};
