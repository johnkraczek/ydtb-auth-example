import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Email2FaButton } from "~/client/components/settings/two-factor-methods/email/setup-email";
import { AuthenticatorButton } from "./authenticator/authenticator-button";
import { SMS2FaButton } from "./sms/sms-button";

export const TwoFactorList = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>2FA Method</TableHead>
          <TableHead className="pr-10 text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell className="flex justify-end">
            <Email2FaButton />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Authenticator</TableCell>
          <TableCell className="flex justify-end">
            <AuthenticatorButton />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SMS</TableCell>
          <TableCell className="flex justify-end">
            <SMS2FaButton />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
