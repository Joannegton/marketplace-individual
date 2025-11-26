"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "./types";

export default function CartCard({
  cart,
  updateQuantity,
  removeFromCart,
  total,
}: Readonly<{
  cart: ReadonlyArray<CartItem>;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  total: number;
}>) {
  return (
    <Card className="border-2 border-amber-200">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-amber-900 font-serif">
          Seu Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Sua sacola está vazia
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 md:p-4 bg-amber-50 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-amber-900 text-sm md:text-base truncate">
                      {item.name}
                    </h3>
                    <p className="text-orange-700 text-sm md:text-base">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-9 w-9 md:h-10 md:w-10 touch-manipulation"
                    >
                      -
                    </Button>
                    <span className="w-8 md:w-10 text-center font-semibold text-sm md:text-base">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-9 w-9 md:h-10 md:w-10 touch-manipulation"
                    >
                      +
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="h-9 w-9 md:h-10 md:w-10 text-red-600 hover:text-red-700 touch-manipulation"
                    >
                      x
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-amber-200 pt-4 space-y-2">
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-amber-900">Subtotal:</span>
                <span className="font-semibold">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg text-orange-700">
                <span>Sinal (50%):</span>
                <span className="font-semibold">
                  R$ {(total * 0.5).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg md:text-xl font-bold text-amber-900">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
