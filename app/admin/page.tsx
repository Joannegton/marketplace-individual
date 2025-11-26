"use client";

import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadImage } from "@/lib/storage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Lock, Plus } from "lucide-react";

type Product = {
  docId?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const cameraInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(Boolean(user));
    });

    let unsubProducts: (() => void) | undefined;
    if (isAuthenticated) {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      unsubProducts = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));
        setProducts(items as Product[]);
      });
    } else {
      setProducts([]);
    }

    return () => {
      unsubAuth();
      if (unsubProducts) unsubProducts();
    };
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Firebase auth error:", err);
      alert("Erro ao autenticar: verifique suas credenciais.");
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", image: "" });
    setSelectedFile(null);
    setIsAdding(true);
    setSheetOpen(true);
  };

  const handleEdit = (product: Product) => {
    console.log("handleEdit called for", product?.id ?? product?.docId);
    setSheetOpen(true);
    setEditingProduct(product);
    setIsAdding(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    });
    setSelectedFile(null);
    setPreviewUrl(product.image || null);
  };

  const handleDelete = async (id: number) => {
    const toDelete = products.find((p) => p.id === id);
    if (!toDelete) return;
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    if (toDelete.docId) {
      try {
        await deleteDoc(doc(db, "products", toDelete.docId));
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir produto");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // upload image if a file is selected
    let imageUrl = formData.image;
    if (selectedFile) {
      try {
        imageUrl = await uploadImage(selectedFile, "products");
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
        alert("Erro ao enviar imagem");
        return;
      }
    }

    if (editingProduct?.docId) {
      try {
        await updateDoc(doc(db, "products", editingProduct.docId), {
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          image: imageUrl || editingProduct.image,
        });
        // close sheet after successful update
        setSheetOpen(false);
      } catch (err) {
        console.error(err);
        alert("Erro ao atualizar produto");
      }
    } else if (isAdding) {
      try {
        await addDoc(collection(db, "products"), {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          image: imageUrl || "/chocolate-panettone.jpg",
          createdAt: serverTimestamp(),
        });
        // close add sheet after successful add
        setSheetOpen(false);
      } catch (err) {
        console.error(err);
        alert("Erro ao adicionar produto");
      }
    }

    setEditingProduct(null);
    setIsAdding(false);
    setFormData({ name: "", description: "", price: "", image: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setFormData({ name: "", description: "", price: "", image: "" });
    setSelectedFile(null);
    setSheetOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-amber-200">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-amber-900" />
            <CardTitle className="text-2xl text-amber-900 font-serif">
              Área Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-amber-900">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-amber-200 focus:border-amber-400 min-h-11"
                  placeholder="admin@exemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-amber-900">
                  Senha de Acesso
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-amber-200 focus:border-amber-400 min-h-11"
                  placeholder="Digite a senha"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-[44px]"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
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
              <p className="text-amber-100 text-sm">Gerenciar Chocotones</p>
            </div>
            <Button
              onClick={() => signOut(auth).catch((err) => console.error(err))}
              variant="outline"
              className="text-amber-900 border-white hover:bg-white/20 w-full sm:w-auto"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom sheet for adding a new product */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) handleCancel();
        }}
      >
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sheet-name" className="text-amber-900">
                Nome do Produto *
              </Label>
              <Input
                id="sheet-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-amber-200 min-h-11"
                placeholder="Ex: Chocotone Tradicional"
                required
              />
            </div>

            <div>
              <Label htmlFor="sheet-description" className="text-amber-900">
                Descrição *
              </Label>
              <Textarea
                id="sheet-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-amber-200 min-h-[100px]"
                placeholder="Descreva o produto..."
                required
              />
            </div>

            <div>
              <Label htmlFor="sheet-price" className="text-amber-900">
                Preço (R$) *
              </Label>
              <Input
                id="sheet-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
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
                <Label className="text-amber-900">Imagem do produto</Label>
                <div className="mt-2 flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setSelectedFile(f);
                      if (f) setPreviewUrl(URL.createObjectURL(f));
                      setFormData({ ...formData, image: "" });
                    }}
                    className="hidden"
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setSelectedFile(f);
                      if (f) setPreviewUrl(URL.createObjectURL(f));
                      setFormData({ ...formData, image: "" });
                    }}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-amber-600 text-white"
                  >
                    Selecionar foto
                  </Button>
                  <Button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-amber-500 text-white"
                  >
                    Tirar foto
                  </Button>

                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setFormData({ ...formData, image: "" });
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Use a câmera ou escolha uma foto. Se não enviar, será usada a
                  imagem padrão.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-[44px]"
              >
                {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="min-h-11 bg-transparent"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

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
              className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600"
            >
              Adicionar Primeiro Produto
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
