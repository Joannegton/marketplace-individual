"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAdminProducts } from "@/hooks/use-admin-products";
import { useAdminProductStore } from "@/store/admin-product.store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { seller, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } =
    useAdminProducts();
  const {
    editingProduct,
    isAdding,
    sheetOpen,
    openAddSheet,
    openEditSheet,
    closeSheet,
  } = useAdminProductStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
    file?: File;
    currentImage?: string;
  }) => {
    let result;

    if (editingProduct?.docId) {
      result = await updateProduct(editingProduct.docId, data);
    } else {
      result = await addProduct(data);
    }

    if (result.success) {
      closeSheet();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Spinner className="w-12 h-12 text-amber-600" />
      </div>
    );
  }

  if (!isAuthenticated || !seller) {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-linear-to-b from-amber-50 to-orange-50 flex flex-col">
      <header className="bg-linear-to-r from-amber-900 to-orange-900 text-white shadow-lg shrink-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif">
                Painel Administrativo
              </h1>
              <p className="text-amber-100 text-sm">
                {seller.storeName} •
                <a
                  href={`/${seller.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white ml-1"
                >
                  Ver loja
                </a>
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-amber-900 border-white hover:bg-white/20 w-full sm:w-auto"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="bottom" className="p-4 sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="text-xl text-amber-900 font-serif">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              {editingProduct
                ? "Atualize os campos e salve as alterações."
                : "Preencha os campos para cadastrar um novo produto."}
            </SheetDescription>
          </SheetHeader>

          <ProductForm
            editingProduct={editingProduct}
            isAdding={isAdding}
            onSubmit={handleSubmit}
            onCancel={closeSheet}
          />
        </SheetContent>
      </Sheet>

      <ProductList
        products={products}
        handleEdit={openEditSheet}
        handleDelete={deleteProduct}
        handleAdd={openAddSheet}
        sheetOpen={sheetOpen}
      />
    </div>
  );
}
