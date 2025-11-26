import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const productsCol = collection(db, 'products')

export async function listProducts() {
  const q = query(productsCol, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ docId: d.id, ...(d.data() as any) }))
}

export async function addProduct(payload: any) {
  return addDoc(productsCol, payload)
}

export async function updateProduct(docId: string, payload: any) {
  return updateDoc(doc(db, 'products', docId), payload)
}

export async function deleteProduct(docId: string) {
  return deleteDoc(doc(db, 'products', docId))
}
