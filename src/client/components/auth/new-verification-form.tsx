"use client";
import React, { useState, useCallback, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { sleep } from "../utils";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "../cards/auth-card-wrapper";
import { ShowSuccess } from "../basic/success-display";
import { ShowError } from "../basic/error-display";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { newEmailVerification } from "~/server/auth/actions/login-flow/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const onValidation = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    const isValid = await newEmailVerification(
      token,
      TokenType.VERIFY_EMAIL_TOKEN,
    );
    if (!isValid.success) {
      setError("Invalid or Expired Token");
      return;
    }
    if (isValid.success) {
      setSuccess("Success!");
      await sleep(2000);
      router.push("/login");
    }
  }, [token, success, error]);

  useEffect(() => {
    onValidation();
  }, [onValidation]);

  return (
    <CardWrapper
      headerTitle="Welcome Back!"
      headerLabel="Confirming your email"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex w-full items-center justify-center pt-5">
        {success && <ShowSuccess message={success} />}
        {!success && <ShowError message={error} />}
        {!success && !error && <BeatLoader />}
      </div>
    </CardWrapper>
  );
};
