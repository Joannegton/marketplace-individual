"use client";

import React from "react";
import ProductGrid from "@/components/shop/ProductGrid";
import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import Hero from "@/components/home/Hero";
import CheckoutPanel from "@/components/checkout/CheckoutPanel";
import { useProductsStore } from "@/store/product.store";
import { useProducts } from "@/hooks/service.hook";
import { useCart } from "@/hooks/cart.hook";
import { useUIStore } from "@/store/ui.store";
import { useShallow } from "zustand/react/shallow";
import { useCheckout } from "@/hooks/checkout.hook";
import { Product } from "@/components/shop/types";

export default function ChocotoneStore() {
  const { cart, addToCart, updateQuantity, removeFromCart, total, count } =
    useCart();

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

  const products = useProductsStore((state) => state.products);
  useProducts();

  const PIX_NUMBER = process.env.NEXT_PUBLIC_PIX_NUMBER ?? "";

  const cartCount = count;

  const { validateOrder, finalizeOrder } = useCheckout();

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <Header
        cartCount={cartCount}
        onToggle={() => setShowCheckout(!showCheckout)}
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
            finalizeOrder={finalizeOrder}
            validateOrder={validateOrder}
            isProcessing={isProcessing}
            PIX_NUMBER={PIX_NUMBER}
            onClose={() => setShowCheckout(false)}
          />
        ) : (
          <Products products={products} addToCart={addToCart} />
        )}
      </div>

      <Footer />
    </div>
  );
}

function Products({
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
