"use client";

import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
