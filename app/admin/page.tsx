"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 flex items-center justify-center">
      <Spinner className="w-12 h-12 text-amber-600" />
    </div>
  );
}
