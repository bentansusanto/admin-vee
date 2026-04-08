"use client";

import { useFormik } from "formik";
import { z } from "zod";
import { useRegisterMutation } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, RegisterValues } from "./schema";

export const useRegisterHook = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const formik = useFormik<RegisterValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      try {
        registerSchema.parse(values);
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
        const result = await register({ ...values, roleName: "owner" }).unwrap();
        if (result) {
          toast.success("Registration successful! Please verify your account.");
          router.push(`/login?message=verify_required&email=${encodeURIComponent(values.email)}`);
        } else {
          toast.error("Registration failed");
        }
      } catch (err: any) {
        toast.error(err.data?.message || err.message || "An error occurred during registration");
      }
    },
  });

  return { formik, isLoading };
};
