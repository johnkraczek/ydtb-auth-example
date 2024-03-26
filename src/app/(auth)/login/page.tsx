import { LoginForm } from "~/client/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <LoginForm />
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1710880694444-970aaf7e7f97?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
            alt="A Macbook Pro on brown wooden table by Clay Banks via UnSplash.com"
          />
        </div>
      </div>
    </>
  );
}
