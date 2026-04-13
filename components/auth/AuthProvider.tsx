"use client";

import { useGetProfileQuery } from "@/redux/services/authApi";
import { useAppSelector } from "@/redux/hooks";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  // Hanya fetch profil untuk mengisi Redux, proteksi rute sudah ada di middleware
  const { isLoading: isFetching } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  const { isLoading: isReduxLoading } = useAppSelector((state) => state.auth);

  // Munculkan loading screen sementara sampai data profile masuk ke Redux
  if (isFetching || isReduxLoading) {
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
