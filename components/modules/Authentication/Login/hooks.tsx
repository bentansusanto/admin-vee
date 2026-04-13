"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { useLoginMutation } from "@/redux/services/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, LoginValues } from "./schema";

export const useLoginHook = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageParam = searchParams.get("message");
  
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (messageParam === "verify_required") {
      toast.info("Registration successful! Check your email to verify your account.", { duration: 10000 });
    }
  }, [messageParam]);

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      try {
        loginSchema.parse(values);
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
        const result = await login(values).unwrap();
        if (result) {
          // Set token mirror cookie for middleware/proxy validation
          const token = result.data?.access_token || result.access_token;
          if (token) {
            document.cookie = `token_mirror=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          
          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          toast.error("Login failed");
        }
      } catch (err: any) {
        toast.error(err.data?.message || err.message || "An error occurred during login");
      }
    },
  });

  return { formik, isLoading };
};
