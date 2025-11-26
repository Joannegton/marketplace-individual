"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package } from "lucide-react";
import { CartItem } from "./types";

export default function DeliveryCard({
  cart,
  formData,
  setFormData,
  showPix,
  showEditPhone,
  setShowEditPhone,
  finalizeOrder,
  validateOrder,
  isProcessing,
  PIX_NUMBER,
}: Readonly<{
  cart: ReadonlyArray<CartItem>;
  formData: any;
  setFormData: (updater: any) => void;
  showPix: boolean;
  setShowPix: (b: boolean) => void;
  showEditPhone: boolean;
  setShowEditPhone: (b: boolean) => void;
  finalizeOrder: () => Promise<void>;
  validateOrder: () => void;
  isProcessing: boolean;
  PIX_NUMBER: string;
}>) {
  return (
    <Card className="border-2 border-amber-200">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-amber-900 font-serif">
          Dados para Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showPix ? (
          <div className="space-y-4">
            {showEditPhone ? (
              <div className="space-y-3">
                <Label htmlFor="edit-whatsapp" className="text-amber-900">
                  Editar WhatsApp
                </Label>
                <Input
                  id="edit-whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ whatsapp: e.target.value })}
                  className="min-h-11"
                />
                <div className="flex gap-2">
                  <Button onClick={() => setShowEditPhone(false)}>
                    Salvar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowEditPhone(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm text-amber-900">
                  Número para contato
                </div>
                <div className="flex items-center justify-between bg-amber-50 p-3 rounded">
                  <div className="font-semibold">
                    {formData.whatsapp || "Não informado"}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowEditPhone(true)}
                  >
                    Editar
                  </Button>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-amber-900 mb-1">
                    PIX
                  </h4>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded">
                      {PIX_NUMBER}
                    </code>
                    <Button
                      onClick={() =>
                        navigator.clipboard
                          ?.writeText(PIX_NUMBER)
                          .catch(() => {})
                      }
                      className="min-h-9"
                      variant="ghost"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end mt-4 w-full">
                  <Button
                    type="button"
                    onClick={finalizeOrder}
                    disabled={cart.length === 0 || isProcessing}
                    className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-base md:text-lg py-6 md:py-7 touch-manipulation font-semibold"
                  >
                    {isProcessing
                      ? "Processando..."
                      : "Envie comprovante WhatsApp"}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validateOrder();
            }}
            className="space-y-4 md:space-y-5"
          >
            <div>
              <Label
                htmlFor="name"
                className="text-amber-900 text-base mb-2 block"
              >
                Nome Completo
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="border-amber-200 focus:border-amber-400 min-h-11 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="whatsapp"
                  className="text-amber-900 flex items-center gap-2 text-base mb-2"
                >
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ whatsapp: e.target.value })}
                  className="border-amber-200 focus:border-amber-400 min-h-11 text-base"
                  type="tel"
                />
              </div>

              <div>
                <Label
                  htmlFor="cpf"
                  className="text-amber-900 text-base mb-2 block"
                >
                  CPF
                </Label>
                <Input
                  id="cpf"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ cpf: e.target.value })}
                  className="border-amber-200 focus:border-amber-400 min-h-11 text-base"
                />
              </div>
            </div>
            <p className="text-sm text-amber-800 mt-2">
              O CPF será usado para comparar com o comprovante do PIX.
            </p>

            <div>
              <Label className="text-amber-900 flex items-center gap-2 mb-3 text-base">
                <Package className="w-4 h-4" /> Forma de Recebimento
              </Label>
              <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(value) =>
                  setFormData({ deliveryMethod: value })
                }
                className="space-y-1"
              >
                <div className="flex items-center space-x-2 px-2 bg-amber-50 rounded-lg touch-manipulation">
                  <RadioGroupItem
                    value="retirar"
                    id="retirar"
                    className="w-5 h-5"
                  />
                  <Label
                    htmlFor="retirar"
                    className="cursor-pointer text-sm flex-1"
                  >
                    Retirar no local
                  </Label>
                </div>
                <div className="flex items-center space-x-2 px-2 bg-amber-50 rounded-lg touch-manipulation">
                  <RadioGroupItem
                    value="entrega"
                    id="entrega"
                    className="w-5 h-5"
                  />
                  <Label
                    htmlFor="entrega"
                    className="cursor-pointer text-sm flex-1"
                  >
                    Entrega via Uber Moto
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.deliveryMethod === "entrega" && (
              <div>
                <Label
                  htmlFor="location"
                  className="text-amber-900 flex items-center gap-2 text-base mb-2"
                >
                  <MapPin className="w-4 h-4" /> Endereço completo
                </Label>
                <Input
                  id="location"
                  required={formData.deliveryMethod === "entrega"}
                  placeholder="Rua, número, bairro"
                  value={formData.location}
                  onChange={(e) => setFormData({ location: e.target.value })}
                  className="border-amber-200 focus:border-amber-400 min-h-11 text-base"
                />
              </div>
            )}

            <Button type="submit" className="min-h-11">
              Pagamento
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
