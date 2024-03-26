import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/client/components/ui/form";
import { Input } from "~/client/components/ui/input";
import { Button } from "~/client/components/ui/button";
import { LoginSchema } from "~/validation/auth";

export const LoginStep = ({
  form,
  isPending,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof LoginSchema>>>;
  isPending: boolean;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} disabled={isPending} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} disabled={isPending} type="password" />
            </FormControl>
            <Button
              size="sm"
              variant="link"
              asChild
              className="flex w-full justify-end px-0 pr-2 font-normal"
            >
              <Link href="/reset">Forgot Password?</Link>
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
