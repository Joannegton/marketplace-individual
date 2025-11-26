import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";

export const useCheckout = () => {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);

  const formData = useUIStore((s) => s.formData);
  const setShowPix = useUIStore((s) => s.setShowPix);
  const setShowSuccess = useUIStore((s) => s.setShowSuccess);
  const setIsProcessing = useUIStore((s) => s.setIsProcessing);
  const setShowCheckout = useUIStore((s) => s.setShowCheckout);

  const validateOrder = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }
    if (
      !formData.name ||
      (formData.deliveryMethod === "entrega" && !formData.location) ||
      !formData.whatsapp ||
      !formData.cpf
    ) {
      alert("Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }
    setShowPix(true);
  };

  const openWhatsApp = (lines: string[]) => {
    try {
      const text = encodeURIComponent(lines.join("\n"));
      const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      const whatsappAppLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;
      const androidIntent = `intent://send?text=${text}#Intent;package=com.whatsapp;scheme=whatsapp;end`;

      const isMobile =
        /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(
          navigator.userAgent
        );

      if (isMobile) {
        try {
          if (/Android/i.test(navigator.userAgent)) {
            globalThis.location.href = androidIntent;
            globalThis.setTimeout(() => {
              globalThis.open(waLink, "_blank");
            }, 1500);
          } else {
            globalThis.location.href = whatsappAppLink;
            globalThis.setTimeout(() => {
              globalThis.open(waLink, "_blank");
            }, 1500);
          }
        } catch (error_) {
          console.warn("Erro abrindo WhatsApp mobile:", error_);
          try {
            globalThis.open(waLink, "_blank");
          } catch (e) {
            console.warn("Erro no fallback wa.me:", e);
          }
        }
      } else {
        try {
          window.open(waLink, "_blank");
        } catch (error_) {
          console.warn("Erro abrindo WhatsApp web:", error_);
        }
      }
    } catch (err) {
      console.error("Erro preparando link do WhatsApp:", err);
    }
  };

  const finalizeOrder = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }
    if (
      !formData.name ||
      (formData.deliveryMethod === "entrega" && !formData.location) ||
      !formData.whatsapp ||
      !formData.cpf
    ) {
      alert("Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }

    setIsProcessing(true);
    try {
      const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      const order = {
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
        customer: { ...formData },
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), order);

      try {
        const lines = [
          "Novo pedido",
          `Cliente: ${formData.name}`,
          `CPF: ${formData.cpf}`,
          `Forma de recebimento: ${formData.deliveryMethod}`,
          `Endereço: ${formData.location}`,
          "",
          "Itens:",
          ...order.items.map(
            (it) => `- ${it.name} x${it.quantity} — R$ ${it.price.toFixed(2)}`
          ),
          "",
          `Total: R$ ${total.toFixed(2)}`,
        ];

        openWhatsApp(lines);
      } catch (err) {
        console.error("Erro ao abrir WhatsApp:", err);
      }

      setShowSuccess(true);
      setShowPix(false);
      clearCart();
      setShowCheckout(false);
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return { validateOrder, finalizeOrder };
};
