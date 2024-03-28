import { user } from "~/server/auth/actions/user";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

const DataRow = ({
  label,
  data,
}: {
  label: string;
  data?: string | null | React.ReactNode;
}) => {
  const dataIsString = typeof data === ("string" || "null");
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-1 shadow-sm">
      <p className="pl-4 text-sm font-medium">{label}</p>
      <div
        className={`max-w[180px] truncate rounded-md p-3 font-mono ${dataIsString ? "bg-slate-100 text-sm" : "text-md"}`}
      >
        {data}
      </div>
    </div>
  );
};

const UserInfo = ({ user, label }: { user?: user; label: string }) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataRow label={"ID"} data={user?.id} />
        <DataRow label="Name" data={user?.name} />
        <DataRow label="Email" data={user?.email} />
        <DataRow label="Role" data={user?.roles.join()} />
        <DataRow
          label="2FA"
          data={
            <Badge
              variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
            >
              {user?.isTwoFactorEnabled ? "ON" : "OFF"}
            </Badge>
          }
        />
      </CardContent>
    </Card>
  );
};

export default UserInfo;
