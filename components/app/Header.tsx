"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  title?: string;
  subtitle?: string;
  cartCount: number;
  onToggle: () => void;
  storeName?: string;
};

export default function Header({
  title,
  subtitle = "Feito com amor e muito chocolate",
  cartCount,
  onToggle,
  storeName,
}: Readonly<Props>) {
  const displayTitle = storeName || title || "Chocotones Artesanais";
  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-amber-900 to-orange-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src="/logo.png"
            alt="Chocotones logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-md"
            aria-hidden={false}
          />
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold font-serif truncate">
              {displayTitle}
            </h1>
            <p className="text-amber-100 text-xs md:text-sm">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
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
  );
}
