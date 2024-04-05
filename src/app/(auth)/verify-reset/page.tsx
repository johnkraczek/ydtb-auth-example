import React from "react";
import { VerifyPasswordForm } from "~/client/components/auth/new-password-form";
import AuthPageWrapper from "~/client/components/auth/page-wrapper";

const VerifyResetPage = () => {
  return (
    <AuthPageWrapper
      image="https://images.unsplash.com/photo-1711348270674-02bc8ac8673c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
      alt="an aerial view of a snow covered forest"
    >
      <VerifyPasswordForm />
    </AuthPageWrapper>
  );
};

export default VerifyResetPage;
