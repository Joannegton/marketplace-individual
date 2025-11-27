"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductGrid from "@/components/shop/ProductGrid";
import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import Hero from "@/components/home/Hero";
import CheckoutPanel from "@/components/checkout/CheckoutPanel";
import { useCart } from "@/hooks/cart.hook";
import { useUIStore } from "@/store/ui.store";
import { useShallow } from "zustand/react/shallow";
import { useCheckout } from "@/hooks/checkout.hook";
import { Product } from "@/components/shop/types";
import { getSellerBySlug, Seller } from "@/hooks/sellers";
import { getProductsBySellerId } from "@/hooks/products";
import { Spinner } from "@/components/ui/spinner";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { useOrderSubmission } from "@/hooks/order-submission";
import { useCheckSubmittedOrder } from "@/hooks/check-submitted-order";

export default function SellerStorePage() {
  const params = useParams();
  const router = useRouter();
  const sellerSlug = params?.sellerSlug as string;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart, total, count } =
    useCart();

  const { isOrderSubmitted } = useOrderSubmission();

  useCheckSubmittedOrder();

  const {
    showCheckout,
    setShowCheckout,
    formData,
    setFormData,
    showPix,
    setShowPix,
    isProcessing,
    showEditPhone,
    setShowEditPhone,
  } = useUIStore(
    useShallow((s) => ({
      showCheckout: s.showCheckout,
      setShowCheckout: s.setShowCheckout,
      formData: s.formData,
      setFormData: s.setFormData,
      showPix: s.showPix,
      setShowPix: s.setShowPix,
      isProcessing: s.isProcessing,
      showEditPhone: s.showEditPhone,
      setShowEditPhone: s.setShowEditPhone,
    }))
  );

  useEffect(() => {
    if (isOrderSubmitted()) {
      router.push(`/${sellerSlug}/sucesso`);
    }
  }, [sellerSlug, router]);

  useEffect(() => {
    const loadSellerAndProducts = async () => {
      setLoading(true);
      try {
        const sellerData = await getSellerBySlug(sellerSlug);

        if (!sellerData?.active) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setSeller(sellerData);

        // Load products for this seller
        const productsData = await getProductsBySellerId(sellerData.id);
        setProducts(productsData as Product[]);
      } catch (error) {
        console.error("Error loading seller store:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (sellerSlug) {
      loadSellerAndProducts();
    }
  }, [sellerSlug]);

  const cartCount = count;
  const { validateOrder, finalizeOrder } = useCheckout(sellerSlug);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <p className="text-amber-900 text-lg">Carregando loja...</p>
        </div>
      </div>
    );
  }

  if (notFound || !seller) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">404</h1>
          <p className="text-xl text-amber-800 mb-6">Loja não encontrada</p>
          <p className="text-gray-600">
            A loja <strong>{sellerSlug}</strong> não está disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <Header
        cartCount={cartCount}
        onToggle={() => setShowCheckout(!showCheckout)}
        storeName={seller.storeName}
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {showCheckout ? (
          <CheckoutPanel
            cart={cart}
            total={total}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            formData={formData}
            setFormData={setFormData}
            showPix={showPix}
            setShowPix={setShowPix}
            showEditPhone={showEditPhone}
            setShowEditPhone={setShowEditPhone}
            finalizeOrder={() =>
              finalizeOrder(seller.uid, seller.whatsappNumber)
            }
            validateOrder={validateOrder}
            isProcessing={isProcessing}
            PIX_NUMBER={seller?.pixNumber}
            onClose={() => setShowCheckout(false)}
            sellerWhatsApp={seller?.whatsappNumber}
          />
        ) : (
          <StoreProducts products={products} addToCart={addToCart} />
        )}
      </div>

      <Footer />
      <WhatsAppFloating
        message="Olá, gostaria informações sobre os chocotones!"
        whatsappNumber={seller?.whatsappNumber}
      />
    </div>
  );
}

function StoreProducts({
  products,
  addToCart,
}: Readonly<{
  products: ReadonlyArray<Product>;
  addToCart: (p: Product) => void;
}>) {
  return (
    <div>
      <Hero />
      <ProductGrid products={products} addToCart={addToCart} />
    </div>
  );
}
