import { LoginForm } from "~/client/components/auth/login-form";
import AuthPageWrapper from "~/client/components/auth/page-wrapper";

export default function LoginPage() {
  return (
    <AuthPageWrapper
      image="https://images.unsplash.com/photo-1710880694444-970aaf7e7f97?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
      alt="A Macbook Pro on brown wooden table by Clay Banks via UnSplash.com"
    >
      <LoginForm />
    </AuthPageWrapper>
  );
}
