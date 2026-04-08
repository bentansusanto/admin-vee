import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { ProductForm } from "@/components/modules/Products/ProductForm";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Add New Product",
    description: "Expand your jewelry collection by adding a new unique piece.",
  });
}

export default function AddProductPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductForm />
    </div>
  );
}
