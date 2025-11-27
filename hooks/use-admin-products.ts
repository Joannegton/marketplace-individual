import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, getAuthInstance } from "@/lib/firebase";
import {
  useAdminProductStore,
  AdminProduct,
} from "@/store/admin-product.store";
import { useAuthStore } from "@/store/auth.store";
import { uploadImage } from "@/hooks/storage";
import { toast } from "./use-toast";

export const useAdminProducts = () => {
  const auth = getAuthInstance();
  const { products, setProducts } = useAdminProductStore();
  const { seller, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !seller) {
      setProducts([]);
      return;
    }

    const q = query(
      collection(db, "products"),
      where("sellerId", "==", seller.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        docId: d.id,
        ...d.data(),
      })) as AdminProduct[];
      setProducts(items);
    });

    return () => unsubscribe();
  }, [isAuthenticated, seller?.id, setProducts]);

  const addProduct = async (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
    file?: File;
  }) => {
    if (!seller) {
      toast({
        title: "Erro",
        description: "Vendedor não encontrado",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!seller.active) {
      toast({
        title: "Loja inativa",
        description: "Sua loja precisa estar ativa para criar produtos",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      let imageUrl = data.image || "/chocolate-panettone.jpg";

      if (data.file) {
        imageUrl = await uploadImage(data.file, "products");
      }

      await addDoc(collection(db, "products"), {
        id: Date.now(),
        sellerId: seller.id,
        createdBy: auth.currentUser?.uid,
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Produto adicionado com sucesso!" });
      return { success: true };
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Erro ao adicionar produto",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateProduct = async (
    docId: string,
    data: {
      name: string;
      description: string;
      price: number;
      image?: string;
      file?: File;
      currentImage?: string;
    }
  ) => {
    try {
      let imageUrl = data.image || data.currentImage;

      if (data.file) {
        imageUrl = await uploadImage(data.file, "products");
      }

      await updateDoc(doc(db, "products", docId), {
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageUrl,
      });

      toast({ title: "Produto atualizado com sucesso!" });
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro ao atualizar produto",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deleteProduct = async (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product?.docId) return { success: false };

    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return { success: false };
    }

    try {
      await deleteDoc(doc(db, "products", product.docId));
      toast({ title: "Produto excluído com sucesso!" });
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro ao excluir produto",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
