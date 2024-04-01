import { Dispatch, SetStateAction, useState } from "react";
import { MdNewLabel } from "react-icons/md";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/client/components/ui/dialog";
import { WelcomeStep } from "./welcome-step";
import { getAuthenticatorQr } from "~/server/auth/actions/account/manage2Fa";
import { sleep } from "~/client/components/utils";
import { GetCodeStep } from "./code-confirm";

export enum steps {
  "welcome",
  "getCode",
}

export const QrSetupDialog = ({
  confirmSuccess,
}: {
  confirmSuccess: () => void;
}) => {
  const [setupStep, setSetupStep] = useState(steps.welcome);
  const [qrURL, setQrURL] = useState("");
  const [open, setOpen] = useState(false);

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
    if (!open) {
      await sleep(500);
      setSetupStep(steps.welcome);
    }
  };

  const successHandler = async () => {
    setOpen(false);
    confirmSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={openHandler}>
      <DialogTrigger>
        <Button
          className="w-52"
          variant={"outline"}
          asChild
          onClick={() => {
            setOpen(true);
          }}
        >
          <div>
            Setup Authenticator
            <span className="pl-3">
              <MdNewLabel size={25} />
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-96">
        {setupStep == steps.welcome && (
          <WelcomeStep qrURL={qrURL} setState={setSetupStep} />
        )}
        {setupStep == steps.getCode && (
          <GetCodeStep successHandler={successHandler} />
        )}
      </DialogContent>
    </Dialog>
  );
};
