"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "./types";

export default function ProductGrid({
  products,
  addToCart,
}: Readonly<{
  products: ReadonlyArray<Product>;
  addToCart: (p: Product) => void;
}>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-amber-200 flex flex-col p-0 gap-0"
        >
          <div className="aspect-square overflow-hidden bg-linear-to-br from-amber-100 to-orange-100 max-h-64">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-2 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl text-amber-900 font-serif line-clamp-2 font-bold">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm leading-snug text-gray-600 h-12 flex items-center">
              {product.description}
            </p>
            <Button
              onClick={() => addToCart(product)}
              className="w-full mt-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white touch-manipulation min-h-11 text-base font-semibold"
            >
              R$ {product.price.toFixed(2)} - Adicionar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
