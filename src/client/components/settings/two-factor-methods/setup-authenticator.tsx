"use client";
import { MdNewLabel } from "react-icons/md";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { TwoFaCodeSchema } from "~/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getAuthenticatorQr,
  validateAuthCode,
} from "~/server/auth/actions/account/manage2Fa";
import { sleep } from "../../utils";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { ShowSuccess } from "../../basic/success-display";
import { ShowError } from "../../basic/error-display";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";

enum steps {
  "welcome",
  "getCode",
  "completed",
}

const SetupAuthenticator = () => {
  const [setupStep, setSetupStep] = useState(steps.welcome);
  const [qrURL, setQrURL] = useState("");

  const openHandler = async (open: boolean) => {
    if (open) {
      const results = await getAuthenticatorQr();
      if (!results) return;
      const imgData = String.fromCharCode.apply(
        null,
        Array.from<number>(results),
      );
      setQrURL(
        URL.createObjectURL(new Blob([imgData], { type: "image/svg+xml" })),
      );
    }

    // close the dialog first and then set the steps back to welcome
    await sleep(500);
    if (!open) setSetupStep(steps.welcome);
  };

  return (
    <Dialog onOpenChange={openHandler}>
      <DialogTrigger>
        <Button className="w-52" variant={"outline"}>
          Setup Authenticator
          <span className="pl-3">
            <MdNewLabel size={25} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-96">
        {setupStep == steps.welcome && (
          <WelcomeStep qrURL={qrURL} setState={setSetupStep} />
        )}
        {setupStep == steps.getCode && <GetCode />}
      </DialogContent>
    </Dialog>
  );
};
export default SetupAuthenticator;

const WelcomeStep = ({
  qrURL,
  setState,
}: {
  qrURL: string;
  setState: Dispatch<SetStateAction<steps>>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Ready to setup your 2FA Authenticator App?</DialogTitle>
        <DialogDescription className="py-5 text-center">
          You will need to have an app like Google Authenticator or LastPass
          Authenticator. Ready? scan the QR code below with your app.
        </DialogDescription>
      </DialogHeader>
      <div className="p-20">
        <img src={qrURL}></img>
      </div>
      <DialogFooter>
        <Button
          asChild
          onClick={() => {
            setState(steps.getCode);
          }}
        >
          <p>Enter First Code</p>
        </Button>
      </DialogFooter>
    </>
  );
};

const GetCode = () => {
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
      const results = await validateAuthCode(values);
      results.success ? setSuccess(results.message) : setError(results.message);
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
