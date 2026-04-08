"use client";

import React from "react";
import { useProductFormHook } from "./hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  IconLoader2,
  IconPlus,
  IconTrash,
  IconChevronLeft,
  IconDiamond,
  IconLink
} from "@tabler/icons-react";
import Link from "next/link";

interface ProductFormProps {
  id?: string;
}

export const ProductForm = ({ id }: ProductFormProps) => {
  const {
    formik,
    isSubmitting,
    isProductLoading,
    isJewelTypesLoading,
    jewelTypes,
    addImageField,
    removeImageField,
    isEdit,
    router
  } = useProductFormHook(id);

  if (isProductLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center text-muted-foreground">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium">Loading jewelry details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon" type="button">
            <IconChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
            {isEdit ? "Edit Product" : "Add New Jewelry"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Update the details of your inventory item." : "Expand your collection with a new exquisite piece."}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: General Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">General Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name_product">Product Name</Label>
              <Input
                id="name_product"
                placeholder="e.g. Diamond Eternity Ring"
                {...formik.getFieldProps("name_product")}
                className={formik.touched.name_product && formik.errors.name_product ? "border-destructive" : ""}
              />
              {formik.touched.name_product && formik.errors.name_product && (
                <p className="text-xs text-destructive">{formik.errors.name_product}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="VP-RING-001"
                  {...formik.getFieldProps("sku")}
                  className={formik.touched.sku && formik.errors.sku ? "border-destructive" : ""}
                />
                {formik.touched.sku && formik.errors.sku && (
                  <p className="text-xs text-destructive">{formik.errors.sku}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jeweltypeId">Category</Label>
                <Select
                  value={formik.values.jeweltypeId}
                  onValueChange={(value) => formik.setFieldValue("jeweltypeId", value)}
                >
                  <SelectTrigger className={formik.touched.jeweltypeId && formik.errors.jeweltypeId ? "border-destructive" : ""}>
                    <SelectValue placeholder={isJewelTypesLoading ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {jewelTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.jeweltypeId && formik.errors.jeweltypeId && (
                  <p className="text-xs text-destructive">{formik.errors.jeweltypeId}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the craftsmanship and materials..."
                rows={5}
                {...formik.getFieldProps("description")}
                className={formik.touched.description && formik.errors.description ? "border-destructive" : ""}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-destructive">{formik.errors.description}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media (URLs)</h3>

            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="flex items-center gap-2">
                <IconLink className="h-4 w-4 text-[#b8860b]" /> Main Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                placeholder="https://example.com/image.jpg"
                {...formik.getFieldProps("thumbnail")}
                className={formik.touched.thumbnail && formik.errors.thumbnail ? "border-destructive" : ""}
              />
              {formik.touched.thumbnail && formik.errors.thumbnail && (
                <p className="text-xs text-destructive">{formik.errors.thumbnail}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <IconLink className="h-4 w-4 text-[#b8860b]" /> Gallery Images
              </Label>
              {formik.values.images.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Gallery Image URL ${index + 1}`}
                    {...formik.getFieldProps(`images[${index}]`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImageField(index)}
                    className="text-gray-400 hover:text-destructive"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
                className="mt-2 text-[#b8860b] border-[#b8860b]/20 hover:bg-[#b8860b]/5"
              >
                <IconPlus className="mr-2 h-4 w-4" /> Add Gallery Image
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Options */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Logistics</h3>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  className={`pl-7 ${formik.touched.price && formik.errors.price ? "border-destructive" : ""}`}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.price && formik.errors.price && (
                <p className="text-xs text-destructive">{formik.errors.price}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  placeholder="e.g. AAA, VVS1"
                  {...formik.getFieldProps("grade")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g. 7, 18cm"
                  {...formik.getFieldProps("size")}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In Stock</Label>
                  <p className="text-xs text-gray-500 italic text-muted-foreground">Is this item available for purchase?</p>
                </div>
                <Switch
                  checked={formik.values.stock_ready}
                  onCheckedChange={(checked) => formik.setFieldValue("stock_ready", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Feature on Home</Label>
                  <p className="text-xs text-gray-500 italic text-muted-foreground">Display in the popular collection.</p>
                </div>
                <Switch
                  checked={formik.values.popular}
                  onCheckedChange={(checked) => formik.setFieldValue("popular", checked)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <Button
              type="submit"
              className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <IconDiamond className="mr-2 h-5 w-5" />
              )}
              {isEdit ? "Update Product" : "Publish Product"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-4 text-gray-500"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
