"use client";
import { useTransition, useState, useEffect } from "react";
import { Skeleton } from "~/client/components/ui/skeleton";
import {
  removeTwoFactorMethodByID,
  userHasTwoFactorType,
} from "~/server/data/two-fa-methods";
import { TWO_FA_TYPE } from "~/server/db/schemas/users/two-factor-methods";
import { QrSetupDialog } from "./qr-setup-dialog";
import { Unlink2FADialog } from "../unlink-2fa-dialog";
import { toast } from "sonner";

export const AuthenticatorButton = () => {
  const [hasAuth, setHasAuth] = useState<string | false | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchAuthStatus = () => {
    startTransition(async () => {
      const result = await userHasTwoFactorType({
        type: TWO_FA_TYPE.AUTHENTICATOR,
      });
      setHasAuth(result);
    });
  };

  useEffect(fetchAuthStatus, []);

  const handleConfirmRemove = async () => {
    const result = await removeTwoFactorMethodByID({
      methodID: hasAuth as string,
    });
    if (result.success) {
      fetchAuthStatus();
      // push toast?
      toast.message("Your Authenticator Method was Removed!");
    }
  };

  const handlConfirmAdd = async () => {
    toast.message("Your Authenticator Method was Added!");
    fetchAuthStatus();
  };

  if (hasAuth === null || isPending) {
    return <Skeleton className="h-[36px] w-[200px]" />;
  }

  if (typeof hasAuth === "string") {
    return (
      <Unlink2FADialog
        alertTitle="Really Remove Authenticator 2FA?"
        alertMessage="This action will remove your Authenticator 2FA. You will need to re-add it later if you want to use it. "
        onConfirm={handleConfirmRemove}
      />
    );
  }

  if (hasAuth === false) {
    return <QrSetupDialog confirmSuccess={handlConfirmAdd} />;
  }
};
