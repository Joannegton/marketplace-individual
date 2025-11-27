"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { AdminProduct } from "@/store/admin-product.store";
import { compressImage } from "@/hooks/image-compression";

interface ProductFormProps {
  editingProduct: AdminProduct | null;
  isAdding: boolean;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
    file?: File;
    currentImage?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  editingProduct,
  isAdding,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        image: editingProduct.image,
      });
      setPreviewUrl(editingProduct.image || null);
    } else {
      setFormData({ name: "", description: "", price: "", image: "" });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      return;
    }

    setIsSubmitting(true);

    try {
      let fileToUpload = selectedFile;

      if (selectedFile) {
        fileToUpload = await compressImage(selectedFile);
      }

      await onSubmit({
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        image: formData.image,
        file: fileToUpload || undefined,
        currentImage: editingProduct?.image,
      });
    } catch (error) {
      console.error("Error preparing file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    setFormData({ ...formData, image: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sheet-name" className="text-amber-900 mb-1">
          Nome do Produto *
        </Label>
        <Input
          id="sheet-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
          className="border-amber-200 min-h-11"
          placeholder="Ex: Chocotone Tradicional"
          required
        />
      </div>

      <div>
        <Label htmlFor="sheet-description" className="text-amber-900 mb-1">
          Descrição *
        </Label>
        <Textarea
          id="sheet-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isSubmitting}
          className="border-amber-200 min-h-[100px]"
          placeholder="Descreva o produto..."
          required
        />
      </div>

      <div>
        <Label htmlFor="sheet-price" className="text-amber-900 mb-1">
          Preço (R$) *
        </Label>
        <Input
          id="sheet-price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          disabled={isSubmitting}
          className="border-amber-200 min-h-11"
          placeholder="45.00"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14">
          <div className="w-full h-full overflow-hidden rounded-md border bg-gray-50 flex items-center justify-center">
            {selectedFile || previewUrl ? (
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : previewUrl ?? "/placeholder.svg"
                }
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-[10px] text-gray-400">Preview</div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <Label className="text-amber-900 mb-1">Imagem do produto</Label>
          <div className="mt-2 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="bg-amber-600 text-white"
            >
              Selecionar foto
            </Button>
            <Button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isSubmitting}
              className="bg-amber-500 text-white"
            >
              Tirar foto
            </Button>

            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (isSubmitting) return;
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setFormData({ ...formData, image: "" });
                }}
                disabled={isSubmitting}
              >
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Use a câmera ou escolha uma foto. Se não enviar, será usada a imagem
            padrão.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-11"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-4 text-white" />
              <span>{editingProduct ? "Salvando..." : "Adicionando..."}</span>
            </>
          ) : editingProduct ? (
            "Salvar Alterações"
          ) : (
            "Adicionar Produto"
          )}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="min-h-11 bg-transparent"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
