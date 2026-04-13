"use client";

import { 
  useGetProductsQuery, 
  useGetProductQuery,
  useDeleteProductMutation, 
  useCreateProductMutation, 
  useUpdateProductMutation,
  useGetJewelTypesQuery
} from "@/redux/services/productApi";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { productSchema, ProductValues } from "./schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const useProductHook = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetProductsQuery(undefined);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const products = data?.data || [];

  const filteredProducts = products.filter((product: any) =>
    (product.name_product?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (product.sku?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete product");
    }
  };

  return {
    products: filteredProducts,
    isLoading,
    isError,
    handleDelete,
    isDeleting,
    searchQuery,
    setSearchQuery,
    refetch,
    router
  };
};

export const useProductFormHook = (id?: string) => {
  const router = useRouter();
  const { data: productData, isLoading: isProductLoading } = useGetProductQuery(id, { skip: !id });
  const { data: jewelTypesData, isLoading: isJewelTypesLoading } = useGetJewelTypesQuery(undefined);
  
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const jewelTypes = jewelTypesData?.data || [];

  const formik = useFormik<ProductValues>({
    initialValues: {
      name_product: "",
      sku: "",
      price: 0,
      description: "",
      grade: "",
      size: "",
      jeweltypeId: "",
      thumbnail: "",
      images: [""],
      video: [""],
      stock_ready: true,
      popular: false,
    },
    enableReinitialize: true,
    validate: (values) => {
      try {
        productSchema.parse(values);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: any = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0]] = err.message;
            }
          });
          return errors;
        }
      }
    },
    onSubmit: async (values) => {
      try {
        // Filter out empty URLs before submitting
        const cleanedValues = {
          ...values,
          images: values.images.filter((url) => url.trim() !== ""),
          video: (values.video || []).filter((url) => url.trim() !== ""),
        };

        if (id) {
          await updateProduct({ id, ...cleanedValues }).unwrap();
          toast.success("Product updated successfully");
        } else {
          await createProduct(cleanedValues).unwrap();
          toast.success("Product created successfully");
        }
        router.push("/dashboard/products");
      } catch (err: any) {
        toast.error(err.data?.message || "An error occurred");
      }
    },
  });

  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      formik.setValues({
        name_product: p.name_product || "",
        sku: p.sku || "",
        price: p.price || 0,
        description: p.description || "",
        grade: p.grade || "",
        size: p.size || "",
        jeweltypeId: p.jeweltypeId || p.jeweltype?.id || "",
        thumbnail: p.thumbnail || "",
        images: p.images?.length ? p.images : [""],
        video: p.video?.length ? p.video : [""],
        stock_ready: p.stock_ready ?? true,
        popular: p.popular ?? false,
      });
    }
  }, [productData]);

  const addImageField = () => {
    formik.setFieldValue("images", [...formik.values.images, ""]);
  };

  const removeImageField = (index: number) => {
    const newImages = [...formik.values.images];
    newImages.splice(index, 1);
    formik.setFieldValue("images", newImages.length ? newImages : [""]);
  };

  return {
    formik,
    isSubmitting: isCreating || isUpdating,
    isProductLoading,
    isJewelTypesLoading,
    jewelTypes,
    addImageField,
    removeImageField,
    isEdit: !!id,
    router
  };
};
