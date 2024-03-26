import { useSession } from "next-auth/react";
import { UserRole } from "~/server/db/schemas/users/user-account";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};

// export const useHasRole = ({ role }: { role: UserRole }) => {
//   const session = useSession();
//   return session.data?.user.roles.includes(role);
// };
