"use client";

import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "~/client/hooks/use-current-user";
import {
  TwoFactorDetails,
  getTwoFactorDetailsByUser,
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
import { Button } from "../../ui/button";
import { MdNewLabel } from "react-icons/md";
import { Unlink2FADialog } from "./unlink-2fa-dialog";
import { TwoFaType } from "~/server/db/schemas/users/two-factor-methods";

export const TwoFactorList = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [methods, setMethods] = useState<TwoFactorDetails[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const results = await getTwoFactorDetailsByUser({ userID: user!.id });
      if (results) {
        setMethods(results);
      }
    });
  }, []);

  const handleSetupClick = (type: string) => {
    if (type == TwoFaType.AUTHENTICATOR) {
      console.log("Auth");
    }
    if (type == TwoFaType.SMS) {
      console.log("SMS");
    }
    if (type == TwoFaType.EMAIL) {
      console.log("Email");
    }
  };

  const getMethodStatus = ({
    label,
    method,
  }: {
    label: string;
    method: string;
  }): React.ReactNode => {
    const result = methods.find((item) => {
      return item.method == method;
    });
    if (result) {
      return (
        <TableCell className="text-right">
          <Unlink2FADialog
            alertTitle={`Unlink ${label} 2FA from your account?`}
            alertMessage={`You are about to unlink this 2FA provider from your account. Are you sure you want to do this?`}
            onConfirm={() => {
              removeTwoFactorMethod(user!.id!, result.id);
            }}
            disabled={false}
          />
        </TableCell>
      );
    }
    return (
      <TableCell className="text-right">
        <Button
          className="w-52"
          variant={"outline"}
          onClick={() => {
            handleSetupClick(label);
          }}
        >
          Setup {label}{" "}
          <span className="pl-3">
            <MdNewLabel size={25} />
          </span>
        </Button>
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
        {Object.keys(TwoFaType).map((item) => {
          const label = TwoFaType[item as keyof typeof TwoFaType];
          return (
            <TableRow key={item}>
              <TableCell>{label}</TableCell>
              {getMethodStatus({ label, method: item })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
