import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShowError } from "~/client/components/basic/error-display";
import { ShowSuccess } from "~/client/components/basic/success-display";
import { Button } from "~/client/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/client/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/client/components/ui/input-otp";
import { sleep } from "~/client/components/utils";
import { validateFirstAuthCode } from "~/server/auth/actions/account/manage2Fa";
import { TwoFaCodeSchema } from "~/validation/auth";

export const GetCodeStep = ({
  successHandler,
}: {
  successHandler: () => void;
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<Zod.infer<typeof TwoFaCodeSchema>>({
    resolver: zodResolver(TwoFaCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof TwoFaCodeSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const results = await validateFirstAuthCode(values);
      if (!results.success) {
        setError(results.message);
        return;
      }
      setSuccess(results.message);
      await sleep(2000);
      successHandler();
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enter the code from you app</DialogTitle>
        <DialogDescription className="py-5 text-center">
          Your app should now be giving you Time Based Codes, <br /> Enter the
          current one here.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          className="space-y-6 text-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex justify-center space-y-4 pt-3">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center">
                  <FormLabel className="self-center p-4">
                    One-Time Password
                  </FormLabel>
                  <FormControl className="text-center">
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

          <ShowSuccess message={success} />
          <ShowError message={error} />

          <Button type="submit" disabled={isPending}>
            Submit Code
          </Button>
        </form>
      </Form>
    </>
  );
};
