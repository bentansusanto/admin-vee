"use client";

import React from "react";
import { useVerifyAccountHook } from "./hooks";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export const VerifyAccountPages = () => {
  const router = useRouter();
  const { isVerifying, isSuccess, isError, handleResend, isResending, email, token } = useVerifyAccountHook();

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Verifying account</h2>
        <p className="text-sm text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Account Verified</h2>
        <p className="text-sm text-gray-600">
          Your account has been successfully verified. You can now access all features of the admin dashboard.
        </p>
        <Button onClick={() => router.push("/login")} className="mt-4 w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  if (isError || (!token && email)) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <XCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
        <p className="text-sm text-gray-600">
          {token 
            ? "The verification link is invalid or has expired. Please request a new link below." 
            : "No verification token found. Please check your email for the correct link."}
        </p>
        <div className="mt-6 flex flex-col gap-3 w-full">
          <Button onClick={handleResend} variant="outline" disabled={isResending} className="w-full">
            {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Resend Verification Email
          </Button>
          <Button onClick={() => router.push("/login")} variant="ghost" className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Mail className="h-16 w-16 text-primary" />
      <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
      <p className="text-sm text-gray-600">
        We've sent a verification link to your email address. Please click the link to verify your account.
      </p>
      <Button onClick={() => router.push("/login")} variant="ghost" className="mt-4 w-full">
        Back to Login
      </Button>
    </div>
  );
};
