import React from "react";
import AuthPageWrapper from "~/client/components/auth/page-wrapper";
import { ResetForm } from "~/client/components/auth/reset-form";

function ResetPasswordPage() {
  return (
    <AuthPageWrapper
      image="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
      alt="space gray iphone x beside turned on laptop"
    >
      <ResetForm />
    </AuthPageWrapper>
  );
}

export default ResetPasswordPage;
