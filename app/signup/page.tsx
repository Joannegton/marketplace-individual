"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";
import {
  createSellerProfile,
  generateSlug,
  isSlugAvailable,
} from "@/hooks/sellers";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Store, Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  // Código de acesso administrativo
  const ADMIN_ACCESS_CODE = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || "";

  const handleAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ADMIN_ACCESS_CODE) {
      setShowForm(true);
    } else {
      toast({
        title: "Código de acesso inválido",
        variant: "destructive",
      });
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    slug: "",
    pixNumber: "",
    whatsappNumber: "",
  });

  const handleStoreNameChange = (storeName: string) => {
    const generatedSlug = generateSlug(storeName);
    setFormData({ ...formData, storeName, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!formData.storeName || !formData.slug) {
      toast({
        title: "Preencha o nome da loja",
        variant: "destructive",
      });
      return;
    }

    if (!formData.pixNumber) {
      toast({
        title: "Preencha a chave PIX",
        variant: "destructive",
      });
      return;
    }

    if (!formData.whatsappNumber) {
      toast({
        title: "Preencha o número do WhatsApp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if slug is available
      const slugAvailable = await isSlugAvailable(formData.slug);
      if (!slugAvailable) {
        toast({
          title: "Este nome de loja já está em uso",
          description: "Tente outro nome para sua loja",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create Firebase Auth user
      const auth = getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create seller profile in Firestore
      await createSellerProfile({
        uid: userCredential.user.uid,
        email: formData.email,
        storeName: formData.storeName,
        slug: formData.slug,
        pixNumber: formData.pixNumber || undefined,
        whatsappNumber: formData.whatsappNumber || undefined,
      });

      toast({
        title: "Conta criada com sucesso! 🎉",
        description: `Sua loja: ${globalThis.location.origin}/${formData.slug}`,
      });

      // Redirect to admin panel
      router.push("/admin");
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "Erro ao criar conta";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está cadastrado";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca";
      }

      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-amber-200">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-amber-900" />
            <CardTitle className="text-2xl text-amber-900 font-serif">
              Área Administrativa
            </CardTitle>
            <CardDescription>
              Esta página é restrita para administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessCode} className="space-y-4">
              <div>
                <Label htmlFor="accessCode" className="text-amber-900 mb-1">
                  Código de Acesso
                </Label>
                <Input
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="border-amber-200 focus:border-amber-400 min-h-11"
                  placeholder="Digite o código"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-11"
              >
                Acessar
              </Button>
              <p className="text-center text-sm text-gray-600">
                <Link
                  href="/"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Voltar para a página inicial
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 border-amber-200">
        <CardHeader className="text-center">
          <Store className="w-12 h-12 mx-auto mb-4 text-amber-900" />
          <CardTitle className="text-2xl text-amber-900 font-serif">
            Criar Nova Loja
          </CardTitle>
          <CardDescription>
            Preencha os dados para criar uma nova loja de chocotones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeName" className="text-amber-900 mb-1">
                Nome da Loja *
              </Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="Ex: Chocotone da Joaninha"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-amber-900 mb-1">
                URL da Loja *
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {globalThis.location.origin}/
                </span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="border-amber-200 focus:border-amber-400 min-h-11"
                  placeholder="chocotone-joaninha"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Este será o endereço único da sua loja
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="text-amber-900 mb-1">
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-amber-900 mb-1">
                Senha *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-amber-900 mb-1">
                Confirmar Senha *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="Digite a senha novamente"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="whatsappNumber" className="text-amber-900 mb-1">
                WhatsApp *
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="(11) 99999-9999"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="pixNumber" className="text-amber-900 mb-1">
                Chave PIX *
              </Label>
              <Input
                id="pixNumber"
                value={formData.pixNumber}
                onChange={(e) =>
                  setFormData({ ...formData, pixNumber: e.target.value })
                }
                className="border-amber-200 focus:border-amber-400 min-h-11"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Nova Loja"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              <Link
                href="/admin"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Ir para área administrativa
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
