"use client";

import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    } else if (!authLoading && !roleLoading && role !== "admin" && role !== "developer") {
      router.replace("/dashboard/rules");
    }
  }, [user, authLoading, role, roleLoading, router, pathname]);

  if (authLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!user || (role !== "admin" && role !== "developer")) {
    return null;
  }

  return <>{children}</>;
}
