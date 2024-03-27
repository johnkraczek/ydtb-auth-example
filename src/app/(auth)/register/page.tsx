import AuthPageWrapper from "~/client/components/auth/page-wrapper";
import { RegisterForm } from "~/client/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthPageWrapper
      image="https://images.unsplash.com/photo-1587820784436-7a9a0f956db1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
      alt="A Macbook Pro on brown wooden table by Clay Banks via UnSplash.com"
    >
      <RegisterForm />
    </AuthPageWrapper>
  );
}
