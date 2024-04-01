import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import SetupSMS from "./setup-sms";
import SetupEmail from "./setup-email";
import { AuthenticatorButton } from "./authenticator/authenticator-button";

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
            <SetupEmail />
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
            {/* <SetupSMS /> */}
            <div>Setup SMS</div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
