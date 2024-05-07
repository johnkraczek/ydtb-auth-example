import { User } from "~/server/auth/actions/user";

const DataRow = ({ data, label }: { data: string; label: string }) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-sm border p-1 shadow-sm">
      <p className="pl-4 text-sm font-medium">{label}</p>
      <div
        className={
          'max-w[100px] "bg-slate-100 text-sm" truncate rounded-sm p-3 font-mono'
        }
      >
        {data}
      </div>
    </div>
  );
};

const UserInfo = ({ user }: { user?: User }) => {
  if (user !== false) {
    const userData = user;
    return (
      <>
        <DataRow data={userData!.id!} label="User ID: " />
        <DataRow data={userData!.name!} label="Name: " />
        <DataRow data={userData!.email!} label="Email: " />
        <DataRow data={userData!.roles!.join(", ")} label="User Roles: " />
        <DataRow data={userData!.image!.substring(0, 50)} label="Image URL: " />
      </>
    );
  }
};

export default UserInfo;
