"use client";
import { useEffect, useState, useTransition } from "react";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { UnlinkProviderDialog } from "./removeDialog";
import {
  UserOAuthProfile,
  getOAuthAccounts,
  removeProviderAccount,
} from "~/server/auth/actions/account/manageOAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";

const AccountList = () => {
  const [isPending, startTransition] = useTransition();
  const [accounts, setAccounts] = useState<UserOAuthProfile[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const accounts = await getOAuthAccounts();
      if (accounts) {
        setAccounts(accounts);
      }
    });
  }, []);

  const providerNames = {
    google: { name: "Google", icon: <FaGoogle /> },
    discord: { name: "Discord", icon: <FaDiscord /> },
    github: { name: "GitHub", icon: <FaGithub /> },
  };

  const handleUnlink = async (provider: string) => {
    await removeProviderAccount(provider);
    const accounts = await getOAuthAccounts();
    if (accounts) {
      setAccounts(accounts);
    }
  };

  const link = async (provider: string) => {
    const results = await signIn(provider);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(providerNames).map((row) => {
            const provider = accounts.find((item) => item.providerName == row);
            if (provider) {
              const providerDisplay =
                providerNames[
                  provider.providerName as keyof typeof providerNames
                ].name;
              return (
                <TableRow key={provider.providerName}>
                  <TableCell>{providerDisplay}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={provider?.image} />
                    </Avatar>
                  </TableCell>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell className="text-right">
                    <UnlinkProviderDialog
                      provider={row}
                      display={providerDisplay}
                      onConfirm={handleUnlink}
                    />
                  </TableCell>
                </TableRow>
              );
            }
            return (
              <TableRow key={row}>
                <TableCell>
                  {providerNames[row as keyof typeof providerNames].name}
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {providerNames[row as keyof typeof providerNames].icon}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>---</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => link(row)}>
                    {providerNames[row as keyof typeof providerNames].icon}{" "}
                    <span className="pl-3"> Sign In </span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
export default AccountList;
