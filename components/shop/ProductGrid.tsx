"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "./types";

export default function ProductGrid({
  products,
  addToCart,
}: {
  products: ReadonlyArray<Product>;
  addToCart: (p: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-amber-200"
        >
          <div className="aspect-square overflow-hidden bg-linear-to-br from-amber-100 to-orange-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl text-amber-900 font-serif">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm md:text-base leading-relaxed">
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-2xl md:text-3xl font-bold text-orange-700">
                R$ {product.price.toFixed(2)}
              </span>
              <Button
                onClick={() => addToCart(product)}
                className="w-full sm:w-auto bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white touch-manipulation min-h-11 text-base"
              >
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
