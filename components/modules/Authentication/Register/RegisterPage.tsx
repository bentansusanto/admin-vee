"use client";

import React from "react";
import RegisterForm from "./RegisterForm";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export const RegisterPage = () => {
  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <img src={`/images/cover.png`} alt="Register visual" className="h-full w-full object-cover" />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Register</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a new account to access the dashboard.
            </p>
          </div>

          <div className="mt-8">
            <RegisterForm />
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-muted px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
