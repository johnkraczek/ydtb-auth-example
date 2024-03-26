"use client";
import React, { useState, useCallback, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { sleep } from "../utils";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "../cards/auth-card-wrapper";
import { ShowSuccess } from "../basic/success-display";
import { ShowError } from "../basic/error-display";
import { newVerification } from "~/server/auth/actions/login-flow/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const onSubmit = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError("Invalid or missing token");
      return;
    }
    const result = await newVerification(token);
    if (!result.success) {
      setError(result.message);
      return;
    }
    if (result.success) {
      setSuccess(result.message);
      await sleep(2000);
      router.push("/login");
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerTitle="Welcome Back!"
      headerLabel="Confirming your email"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex w-full items-center justify-center pt-5">
        <ShowSuccess message={success} />
        {!success && <ShowError message={error} />}
        {!success && !error && <BeatLoader />}
      </div>
    </CardWrapper>
  );
};
