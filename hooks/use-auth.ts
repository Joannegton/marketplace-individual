import { useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";
import { getSellerByUid } from "@/hooks/sellers";
import { toast } from "./use-toast";

export const useAuth = () => {
  const auth = getAuthInstance();
  const {
    user,
    seller,
    isAuthenticated,
    isLoading,
    setUser,
    setSeller,
    setIsLoading,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const sellerData = await getSellerByUid(firebaseUser.uid);
          setSeller(sellerData);

          if (!sellerData) {
            toast({
              title: "Perfil de vendedor não encontrado",
              description: "Por favor, complete seu cadastro em /signup",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error loading seller profile:", error);
          setSeller(null);
        }
      } else {
        setSeller(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setSeller, setIsLoading]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    seller,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
  };
};
