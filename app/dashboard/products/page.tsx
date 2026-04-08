import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";
import { ProductList } from "@/components/modules/Products/ProductList";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Product Inventory",
    description: "Manage your luxury jewelry collection and stock levels.",
  });
}

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductList />
    </div>
  );
}
