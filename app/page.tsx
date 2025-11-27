"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, TrendingUp, MessageCircle } from "lucide-react";

export default function HomePage() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511970179936";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Olá! Gostaria de saber mais sobre a ChocoPlatform."
  )}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <header className="bg-linear-to-r from-amber-900 to-orange-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold font-serif">
              ChocoPlatform
            </h1>
            <Link href="/admin">
              <Button
                variant="outline"
                className="text-amber-900 border-white hover:bg-white/20"
              >
                Área do Vendedor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6 font-serif">
            Sua Loja Virtual de Chocotones
          </h2>
          <p className="text-xl md:text-2xl text-orange-800 mb-8">
            Plataforma completa para vendedores gerenciarem seus produtos e
            receberem pedidos pelo WhatsApp.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale Conosco no WhatsApp
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200">
            <Store className="w-12 h-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Loja Personalizada
            </h3>
            <p className="text-gray-700">
              Cada vendedor tem sua própria URL exclusiva com sua marca e
              produtos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200">
            <ShoppingBag className="w-12 h-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Gestão Simplificada
            </h3>
            <p className="text-gray-700">
              Painel administrativo intuitivo para gerenciar produtos e pedidos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200">
            <TrendingUp className="w-12 h-12 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Pedidos no WhatsApp
            </h3>
            <p className="text-gray-700">
              Seus clientes finalizam pedidos e entram em contato direto pelo
              WhatsApp
            </p>
          </div>
        </div>

        <div className="text-center mt-16 bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto border-2 border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">
            Quer ter sua loja na ChocoPlatform?
          </h3>
          <p className="text-gray-700 mb-6">
            Entre em contato conosco pelo WhatsApp para receber o formulário de
            cadastro e ativar sua loja online.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Cadastro
            </Button>
          </a>
        </div>
      </main>

      <footer className="bg-linear-to-r from-amber-900 to-orange-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-100">
            © 2024 ChocoPlatform - Plataforma para vendedores de chocotones
          </p>
        </div>
      </footer>
    </div>
  );
}
