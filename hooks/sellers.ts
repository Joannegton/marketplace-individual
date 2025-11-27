import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type Seller = {
  id: string;
  uid: string; // Firebase Auth UID
  email: string;
  storeName: string;
  slug: string; // URL-friendly unique identifier (e.g., "chocooneJoaninha")
  active: boolean; // Store is active/paid
  pixNumber?: string;
  whatsappNumber?: string;
  createdAt: any;
  updatedAt: any;
};

const sellersCol = collection(db, "sellers");

/**
 * Get seller by slug
 */
export async function getSellerBySlug(slug: string): Promise<Seller | null> {
  const q = query(sellersCol, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Seller;
}

/**
 * Get seller by Firebase Auth UID
 */
export async function getSellerByUid(uid: string): Promise<Seller | null> {
  const q = query(sellersCol, where("uid", "==", uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Seller;
}

/**
 * Check if slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const seller = await getSellerBySlug(slug);
  return seller === null;
}

/**
 * Create a new seller profile
 */
export async function createSellerProfile(data: {
  uid: string;
  email: string;
  storeName: string;
  slug: string;
  pixNumber?: string;
  whatsappNumber?: string;
}): Promise<string> {
  const docRef = await addDoc(sellersCol, {
    ...data,
    active: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Generate a URL-friendly slug from store name
 */
export function generateSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "") // Remove accents
    .replaceAll(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replaceAll(/^-+/g, "") // Remove leading hyphens
    .replaceAll(/-+$/g, "") // Remove trailing hyphens
    .substring(0, 50); // Limit length
}
