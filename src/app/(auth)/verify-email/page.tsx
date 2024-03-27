import React from "react";
import { NewVerificationForm } from "~/client/components/auth/new-verification-form";
import AuthPageWrapper from "~/client/components/auth/page-wrapper";

export const NewVerificationPage = () => {
  return (
    <AuthPageWrapper
      image="https://images.unsplash.com/photo-1711426793204-b549cd02eaca?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
      alt="an open door leading to a balcony overlooking the ocean"
    >
      <NewVerificationForm />
    </AuthPageWrapper>
  );
};

export default NewVerificationPage;
