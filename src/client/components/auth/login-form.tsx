"use client";
import z from "zod";
import { Form } from "~/client/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { loginAction } from "~/server/auth/actions/loginAction";
import { ShowError } from "~/client/components/basic/error-display";
import { ShowSuccess } from "~/client/components/basic/success-display";
import { Button } from "~/client/components/ui/button";
import { CardWrapper } from "~/client/components/cards/auth-card-wrapper";
import { LoginStep } from "./login-flow/login-step";
import { LoginSchema } from "~/validation/auth";

enum loginFlowStep {
  "login",
}

export const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [flowStep, setFlowStep] = useState(loginFlowStep.login);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>): void => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const results = await loginAction(values);

      if (!results.success) {
        form.reset();
        return setError(results.message);
      }

      if (results.success === true) {
        setSuccess(results.message);
        form.reset();
      }
    });
  };

  return (
    <CardWrapper
      headerTitle="🔐 Login"
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {flowStep == loginFlowStep["login"] && (
              <LoginStep form={form} isPending={isPending} />
            )}
          </div>

          <ShowError message={error} />

          <ShowSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {flowStep == loginFlowStep["login"] && "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
