import { z } from "zod";

export const productSchema = z.object({
  name_product: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  grade: z.string().min(1, "Grade is required"),
  size: z.string().optional(),
  jeweltypeId: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Please enter a valid thumbnail URL"),
  images: z.array(z.string().url("Please enter a valid image URL")).min(1, "At least one image is required"),
  video: z.array(z.string().url("Please enter a valid video URL")).optional(),
  stock_ready: z.boolean().default(true),
  popular: z.boolean().default(false),
});

export type ProductValues = z.infer<typeof productSchema>;
