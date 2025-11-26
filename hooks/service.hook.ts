import { useEffect } from "react";
import { Product } from "@/components/shop/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { toast } from "./use-toast";
import { useProductsStore } from "@/store/product.store";

export const useProducts = () => {
  const setProducts = useProductsStore((s) => s.setProducts);
  const setLoading = useProductsStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    const q = query(collection(db, "products"), orderBy("price", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setLoading(false);
          return;
        }
        const items = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id ?? Date.now(),
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
          } as Product;
        });
        setProducts(items);
        setLoading(false);
      },
      (error) => {
        toast({
          title: "Erro ao carregar produtos, entre em contato pelo whatsapp",
          description:
            (error && (error.message || String(error))) ?? "Erro desconhecido",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsub();
  }, [setLoading, setProducts]);
};
