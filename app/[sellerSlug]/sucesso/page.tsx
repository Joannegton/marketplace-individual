"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/cart.hook";
import { useOrderSubmission } from "@/hooks/order-submission";
import { getSellerBySlug, Seller } from "@/hooks/sellers";
import { Spinner } from "@/components/ui/spinner";

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const sellerSlug = params?.sellerSlug as string;
  const { clearCart } = useCart();
  const { clearOrderSubmission } = useOrderSubmission();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeller = async () => {
      if (sellerSlug) {
        try {
          const sellerData = await getSellerBySlug(sellerSlug);
          setSeller(sellerData);
        } catch (error) {
          console.error("Error loading seller:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSeller();
  }, [sellerSlug]);

  const whatsappNumber = seller?.whatsappNumber || "5511970179936";

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <p className="text-amber-900 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2 className="w-24 h-24 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-serif">
            Pedido Recebido!
          </h1>

          <p className="text-lg md:text-xl text-orange-800 mb-6">
            Obrigado por sua compra! Verifique se o comprovante foi enviado ao
            whatsapp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                clearCart();
                clearOrderSubmission();
                router.push(`/${sellerSlug}`);
              }}
              size="lg"
              className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg px-8 py-6"
            >
              Finalizar
            </Button>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Mensagem
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
