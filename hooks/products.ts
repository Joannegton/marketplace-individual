import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const productsCol = collection(db, "products");

/**
 * List all products (for admin or specific seller)
 */
export async function listProducts(sellerId?: string) {
  let q;
  if (sellerId) {
    q = query(
      productsCol,
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(productsCol, orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ docId: d.id, ...(d.data() as any) }));
}

/**
 * Get products by seller slug
 */
export async function getProductsBySellerId(sellerId: string) {
  const q = query(
    productsCol,
    where("sellerId", "==", sellerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ docId: d.id, ...(d.data() as any) }));
}

export async function addProduct(payload: any) {
  return addDoc(productsCol, payload);
}

export async function updateProduct(docId: string, payload: any) {
  return updateDoc(doc(db, "products", docId), payload);
}

export async function deleteProduct(docId: string) {
  return deleteDoc(doc(db, "products", docId));
}
