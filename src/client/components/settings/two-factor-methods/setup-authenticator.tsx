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
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TwoFaCodeSchema } from "~/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthenticatorQr } from "~/server/auth/actions/account/manage2Fa";
import { sleep } from "../../utils";

enum steps {
  "welcome",
  "get-code",
  "verify",
}

const SetupAuthenticator = () => {
  const [setupStep, setSetupStep] = useState(steps.welcome);
  const [qrURL, setQrURL] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<Zod.infer<typeof TwoFaCodeSchema>>({
    resolver: zodResolver(TwoFaCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    startTransition(async () => {
      const results = await getAuthenticatorQr();

      if (!results) return;
      const imgData = String.fromCharCode.apply(
        null,
        Array.from<number>(results),
      );
      setQrURL(
        URL.createObjectURL(new Blob([imgData], { type: "image/svg+xml" })),
      );
    });
  }, []);

  const closeHandler = async (open: boolean) => {
    // close the dialog first and then set the steps back to welcome
    await sleep(500);
    if (!open) setSetupStep(steps.welcome);
  };

  return (
    <Dialog onOpenChange={closeHandler}>
      <DialogTrigger>
        <Button className="w-52" variant={"outline"}>
          Setup Authenticator
          <span className="pl-3">
            <MdNewLabel size={25} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-96">
        {setupStep == steps.welcome && <WelcomeStep qrURL={qrURL} />}
        <DialogFooter>
          {setupStep == steps.welcome && (
            <Button
              asChild
              onClick={() => {
                setSetupStep(steps["get-code"]);
              }}
            >
              <p>Confirm Your Code</p>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default SetupAuthenticator;

const WelcomeStep = ({ qrURL }: { qrURL: string }) => {
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
    </>
  );
};
