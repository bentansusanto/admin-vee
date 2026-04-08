import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { RegisterPage } from "@/components/modules/Authentication/Register/RegisterPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Register Page",
    description: "Create a new account for the Veepearl admin dashboard.",
  });
}

export default function Page() {
  return <RegisterPage />;
}
