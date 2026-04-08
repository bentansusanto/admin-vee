import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { ProductForm } from "@/components/modules/Products/ProductForm";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Edit Product",
    description: "Update the details of your exquisite jewelry piece.",
  });
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductForm id={id} />
    </div>
  );
}
