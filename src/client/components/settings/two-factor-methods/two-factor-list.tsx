"use client";

import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "~/client/hooks/use-current-user";
import {
  TwoFactorDetails,
  getTwoFactorMethodDetailsByUser,
  removeTwoFactorMethod,
} from "~/server/data/two-fa-methods";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Unlink2FADialog } from "./unlink-2fa-dialog";

import SetupSMS from "./setup-sms";
import SetupAuthenticator from "./setup-authenticator";
import {
  TWO_FA_DISPLAY,
  TWO_FA_TYPE,
  TwoFaType,
} from "~/server/db/schemas/users/two-factor-methods";

export const TwoFactorList = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [methods, setMethods] = useState<TwoFactorDetails[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const results = await getTwoFactorMethodDetailsByUser({
        userID: user!.id,
      });
      if (results) {
        setMethods(results);
      }
    });
  }, []);

  const getMethodByType = (type: TwoFaType) => {
    return methods.find((item) => {
      return item.method == type;
    });
  };

  const getMethodStatus = ({
    method,
    display,
    methodID,
  }: {
    method?: TwoFaType;
    display?: string;
    methodID?: string;
  }): React.ReactNode => {
    if (methodID) {
      return (
        <TableCell className="text-right">
          <Unlink2FADialog
            alertTitle={`Unlink ${display} 2FA from your account?`}
            alertMessage={`You are about to unlink this 2FA provider from your account. Are you sure you want to do this?`}
            onConfirm={() => {
              removeTwoFactorMethod(user!.id, methodID);
            }}
            disabled={false}
          />
        </TableCell>
      );
    }
    return (
      <TableCell className="text-right">
        {method == TWO_FA_TYPE.EMAIL && <div>EMAIL</div>}
        {method == TWO_FA_TYPE.AUTHENTICATOR && <SetupAuthenticator />}
        {method == TWO_FA_TYPE.SMS && <SetupSMS />}
      </TableCell>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>2FA Method</TableHead>
          <TableHead className="pr-10 text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(TWO_FA_TYPE).map((item) => {
          const method = item as TwoFaType;
          const result = getMethodByType(method);
          return (
            <TableRow key={item}>
              <TableCell>{TWO_FA_DISPLAY[method]}</TableCell>
              {getMethodStatus({
                method,
                methodID: result?.id,
                display: result?.display,
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
