"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useGetProfileQuery } from "@/redux/services/authApi";

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  
  // Check if we have an active session
  const { data, isLoading, isError } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If authenticated by either Redux or the profile query, redirect to dashboard
    if (isAuthenticated || (!isLoading && !isError && data)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, data, isLoading, isError, router]);

  // While checking, we can show a placeholder or just null to prevent flickering
  if (isLoading && !isAuthenticated) {
    return null; // Or a smaller skeleton if preferred
  }

  return <>{children}</>;
}
