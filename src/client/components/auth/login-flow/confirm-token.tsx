import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "~/validation/auth";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";

export const ConfirmToken = ({
  form,
  isPending,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof LoginSchema>>>;
  isPending: boolean;
}) => {
  return (
    <div className="flex justify-center pt-3">
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-center">
            <FormLabel className="self-center p-4">One-Time Password</FormLabel>
            <FormControl>
              <InputOTP disabled={isPending} maxLength={6} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription className="self-center">
              Please enter the one-time code.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
