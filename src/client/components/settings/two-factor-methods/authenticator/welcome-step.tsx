import { Dispatch, SetStateAction } from "react";
import { steps } from "./qr-setup-dialog";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import { Button } from "~/client/components/ui/button";

export const WelcomeStep = ({
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
