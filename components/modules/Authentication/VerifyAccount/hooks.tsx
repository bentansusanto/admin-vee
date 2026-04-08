"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyAccountMutation, useResendVerificationMutation } from "@/redux/services/authApi";
import { toast } from "sonner";

export const useVerifyAccountHook = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const token = searchParams.get("verify_token"); // Maps to 'verify_token' from URL

  const [verifyAccount, { isLoading: isVerifying, isSuccess, isError }] = useVerifyAccountMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (email && token && !hasAttempted) {
      setHasAttempted(true);
      handleVerify();
    }
  }, [email, token, hasAttempted]);

  const handleVerify = async () => {
    try {
      const result = await verifyAccount({ token }).unwrap();
      if (result) {
        toast.success("Account verified successfully! You can now log in.");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend verification");
      return;
    }
    try {
      const result = await resendVerification(email).unwrap();
      if (result) {
        toast.success("Verification email resent!");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend verification");
    }
  };

  return {
    isVerifying,
    isSuccess,
    isError,
    handleResend,
    isResending,
    email,
    token
  };
};
