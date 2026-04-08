"use client";

import { useAppSelector } from "@/redux/hooks";
import { useGetProfileQuery } from "@/redux/services/authApi";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { setLoading } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  // We call getProfile on mount to check if the session cookie is valid
  const { data, isLoading, isError, error } = useGetProfileQuery(undefined, {
    // Polling or other options can be added here if needed
  });

  const { isAuthenticated, user, isLoading: isReduxLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const userRole = data.data?.role?.toLowerCase();
      if (userRole !== "admin" && userRole !== "owner") {
        router.replace("/login?error=unauthorized");
      }
    }
    
    if (isError && !isLoading) {
      router.replace("/login");
    }
  }, [data, isLoading, isError, router]);

  // Loading state
  if (isLoading || isReduxLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
