"use client";

import React from "react";
import { useProducts } from "@/hooks/service.hook";

export default function ProductsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useProducts();
  return <>{children}</>;
}
