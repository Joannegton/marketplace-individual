import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus } from "lucide-react";

type Product = {
  docId?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type Props = {
  products: Product[];
  handleEdit: (p: Product) => void;
  handleDelete: (id: number) => Promise<void> | void;
  handleAdd: () => void;
  sheetOpen: boolean;
};

export default function ProductList(props: Readonly<Props>) {
  const { products, handleEdit, handleDelete, handleAdd, sheetOpen } = props;
  return (
    <div className="flex-1 overflow-auto container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-10 bg-background border-b border-border py-3">
        <h2 className="text-2xl font-bold text-amber-900">
          Produtos Cadastrados
        </h2>
        {!sheetOpen && (
          <Button
            onClick={handleAdd}
            className="bg-amber-600 text-white hover:bg-amber-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="border-2 border-amber-200 p-3">
            <div className="w-full h-36 overflow-hidden rounded-md bg-linear-to-br from-amber-100 to-orange-100">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="py-0">
              <CardTitle className="text-base text-amber-900 font-serif truncate">
                {product.name}
              </CardTitle>
              <p className="text-xs text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold text-orange-700 mt-0">
                R$ {product.price.toFixed(2)}
              </p>
            </CardHeader>
            <CardContent className="flex gap-4 -mt-3">
              <Button
                onClick={() => handleEdit(product)}
                variant="outline"
                size="sm"
                className="w-1/2 border-amber-300 hover:bg-amber-50"
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(product.id)}
                variant="outline"
                size="sm"
                className="w-1/2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Excluir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum produto cadastrado ainda.
          </p>
          <Button
            onClick={handleAdd}
            className="mt-4 bg-linear-to-r from-amber-600 to-orange-600"
          >
            Adicionar Primeiro Produto
          </Button>
        </div>
      )}
    </div>
  );
}
