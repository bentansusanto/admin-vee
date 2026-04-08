"use client";

import React from "react";
import { useProductHook } from "./hooks";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  IconEdit, 
  IconTrash, 
  IconPlus, 
  IconSearch,
  IconDiamond,
  IconLoader2
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const ProductList = () => {
  const { 
    products, 
    isLoading, 
    isError, 
    handleDelete, 
    isDeleting, 
    searchQuery, 
    setSearchQuery,
    refetch,
    router
  } = useProductHook();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium">Loading jewelry collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your exquisite jewelry inventory.</p>
        </div>
        <Button 
          className="bg-[#b8860b] hover:bg-[#9a7b0a] text-white"
          onClick={() => router.push("/dashboard/products/add")}
        >
          <IconPlus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm">
        <IconSearch className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products by name or SKU..."
          className="border-none bg-transparent focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <IconDiamond className="h-8 w-8 text-gray-200" />
                    <p>No products found in the collection.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name_product} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <IconDiamond className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{product.name_product}</span>
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{product.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-gray-600 border-gray-200">
                      {product.jeweltype?.name || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.stock_ready ? (
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-none px-2.5">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-50 text-gray-500 hover:bg-gray-100 border-none px-2.5">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
