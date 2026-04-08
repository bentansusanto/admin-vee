import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyAccountPages } from "@/components/modules/Authentication/VerifyAccount/VerifyAccountPages";
import { Loader2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Verify Account",
    description: "Verify your Veepearl admin account email address.",
  });
}

export default function VerifyAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Initializating...</h2>
          </div>
        }>
          <VerifyAccountPages />
        </Suspense>
      </div>
    </div>
  );
}
