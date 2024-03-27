"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordVerifySchema } from "~/validation/auth";
import { newPaswordAction } from "~/server/auth/actions/new-password";
import { sleep } from "../utils";
import { CardWrapper } from "../cards/auth-card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ShowSuccess } from "../basic/success-display";
import { ShowError } from "../basic/error-display";
import { Button } from "../ui/button";

export const VerifyPasswordForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setCompleted] = useState(false);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof PasswordVerifySchema>>({
    resolver: zodResolver(PasswordVerifySchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordVerifySchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const results = await newPaswordAction({
        values,
        token,
      });
      if (results.success) {
        setSuccess(results.message);
        setCompleted(true);
        await sleep(2000);
        router.push("/login");
      } else setError(results.message);
    });
  };

  return (
    <CardWrapper
      headerTitle="New Password Input"
      headerLabel="Create a new Password"
      backButtonLabel="Back to Login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending || isCompleted}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ShowSuccess message={success} />
          <ShowError message={error} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isCompleted}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
