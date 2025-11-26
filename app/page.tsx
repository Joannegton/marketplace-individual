"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import ProductGrid from "@/components/shop/ProductGrid";
import CartCard from "@/components/shop/CartCard";
import DeliveryCard from "@/components/shop/DeliveryCard";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

export default function ChocotoneStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    deliveryMethod: "retirar",
    whatsapp: "",
    cpf: "",
  });
  const [showPix, setShowPix] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          return;
        }
        const items = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id ?? Date.now(),
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
          } as Product;
        });
        setProducts(items);
      },
      (err) => {
        console.error("Firestore error reading products:", err);
      }
    );

    return () => unsub();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // números configuráveis via env (defina NEXT_PUBLIC_WHATSAPP_NUMBER e NEXT_PUBLIC_PIX_NUMBER)
  const WHATSAPP_NUMBER =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511970179936";
  const PIX_NUMBER = process.env.NEXT_PUBLIC_PIX_NUMBER ?? "11970179936";

  const formRef = useRef<HTMLFormElement | null>(null);

  const validateOrder = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }
    if (
      !formData.name ||
      !formData.location ||
      !formData.whatsapp ||
      !formData.cpf
    ) {
      alert("Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }
    setShowPix(true);
  };

  const finalizeOrder = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }
    if (
      !formData.name ||
      !formData.location ||
      !formData.whatsapp ||
      !formData.cpf
    ) {
      alert("Preencha todos os campos obrigatórios antes de finalizar.");
      return;
    }

    setIsProcessing(true);
    try {
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
        const lines: string[] = [];
        lines.push("Novo pedido");
        lines.push(`Cliente: ${formData.name}`);
        lines.push(`CPF: ${formData.cpf}`);
        lines.push(`Forma de recebimento: ${formData.deliveryMethod}`);
        lines.push(`Endereço: ${formData.location}`);
        lines.push("");
        lines.push("Itens:");
        order.items.forEach((it) =>
          lines.push(`- ${it.name} x${it.quantity} — R$ ${it.price.toFixed(2)}`)
        );
        lines.push("");
        lines.push(`Total: R$ ${total.toFixed(2)}`);

        const text = encodeURIComponent(lines.join("\n"));
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
        const whatsappAppLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;

        const isMobile =
          /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(
            navigator.userAgent
          );

        if (isMobile) {
          try {
            const start = Date.now();
            // tentar abrir o app (navegar para o esquema customizado)
            globalThis.location.href = whatsappAppLink;
            // se o app não abrir em ~1.5s, abrir wa.me como fallback
            globalThis.setTimeout(() => {
              if (Date.now() - start < 2000) {
                globalThis.open(waLink, "_blank");
              }
            }, 1500);
          } catch (err) {
            console.warn("Erro ao tentar abrir WhatsApp app:", err);
            // em caso de erro, abrir wa.me
            globalThis.open(waLink, "_blank");
          }
        } else {
          // desktop: abrir wa.me em nova aba
          window.open(waLink, "_blank");
        }
      } catch (err) {
        // se abrir o WhatsApp falhar por qualquer motivo, não interrompe o fluxo
        console.error("Erro ao abrir WhatsApp:", err);
      }

      setShowSuccess(true);
      setShowPix(false);
      setCart([]);
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-linear-to-r from-amber-900 to-orange-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold font-serif truncate">
              Chocotones Artesanais
            </h1>
            <p className="text-amber-100 text-xs md:text-sm">
              Feito com amor e muito chocolate
            </p>
          </div>
          <button
            onClick={() => setShowCheckout(!showCheckout)}
            className="relative p-3 md:p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors touch-manipulation"
          >
            <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-6 h-6 flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {showCheckout ? (
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setShowCheckout(false)}
              variant="ghost"
              className="mb-4 text-amber-900 touch-manipulation min-h-11"
            >
              ← Voltar aos produtos
            </Button>

            {/* PIX / success UI moved below the order cards to keep context near the order details */}

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

            {showSuccess ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center mb-6">
                <h2 className="text-2xl font-semibold text-amber-900 mb-2">
                  Seu pedido foi enviado!
                </h2>
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    setShowCheckout(false);
                  }}
                  className="min-h-11"
                >
                  Voltar
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <section className="text-center mb-8 md:mb-12 py-3 md:py-8">
              <h2 className="text-3xl md:text-5xl font-bold text-amber-900 mb-3 md:mb-4 font-serif px-4">
                Chocotones Irresistíveis
              </h2>
              <p className="text-lg md:text-xl text-orange-800 max-w-2xl mx-auto leading-relaxed px-4">
                Feitos artesanalmente com ingredientes selecionados para adoçar
                suas festas
              </p>
            </section>

            <ProductGrid products={products} addToCart={addToCart} />
          </>
        )}
      </div>

      <footer className="bg-linear-to-r from-amber-900 to-orange-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-100 text-sm md:text-base">
            🍫 Chocotones Artesanais - Feitos com amor
          </p>
          <p className="text-xs md:text-sm text-amber-200 mt-3">
            Criado por{" "}
            <a
              href="https://www.instagram.com/joanne_gton/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Joannegtton
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
