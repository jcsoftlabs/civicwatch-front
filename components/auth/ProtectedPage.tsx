"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingState } from "@/components/ui/AsyncState";
import { useAuth } from "@/lib/auth";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { loading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, token]);

  if (loading || !token) {
    return <LoadingState label="Vérification de la session..." />;
  }

  return children;
}
