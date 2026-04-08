import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { LoginPage } from "@/components/modules/Authentication/Login/LoginPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Login Page",
    description: "A login form with email and password to access the Veepearl dashboard.",
  });
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <LoginPage />
    </Suspense>
  );
}
