"use client";

import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "~/client/hooks/use-current-user";
import {
  TwoFactorDetails,
  getTwoFactorDetailsByUser,
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
import { FaTrash } from "react-icons/fa";
import { MdNewLabel } from "react-icons/md";

const TwoFaMethods = ["Email", "SMS", "Authenticator"];

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

  const handleButton = ({
    link,
    method,
  }: {
    link: boolean;
    method: string;
  }) => {
    console.log("link/unlink", link);
    console.log("method:", method);
  };

  const getMethodStatus = (method: string): React.ReactNode => {
    const result = methods.find((item) => {
      return (
        method.localeCompare(item.method, undefined, {
          sensitivity: "base",
        }) === 0
      );
    });

    if (result) {
      return (
        <TableCell className="text-right">
          <Button
            variant={"destructive"}
            onClick={() => {
              handleButton({ link: false, method });
            }}
          >
            Unlink {method}{" "}
            <span className="pl-3">
              <FaTrash size={15} />
            </span>
          </Button>
        </TableCell>
      );
    }
    return (
      <TableCell className="text-right">
        <Button
          variant={"outline"}
          onClick={() => {
            handleButton({ link: true, method });
          }}
        >
          Setup {method}{" "}
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
        {TwoFaMethods.map((item) => {
          return (
            <TableRow key={item}>
              <TableCell>{item}</TableCell>
              {getMethodStatus(item)}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
