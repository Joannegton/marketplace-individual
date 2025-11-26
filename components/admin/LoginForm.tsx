"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void> | void;
};

export default function LoginForm(props: Readonly<Props>) {
  const { email, setEmail, password, setPassword, handleLogin } = props;
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
              className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-11"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
