"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/client/components/ui/avatar";
import { LogoutButton } from "~/client/components/auth/logout-button";
import { useCurrentUser } from "~/client/hooks/use-current-user";
import { Button } from "../ui/button";

export const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"} asChild className="h-14">
          <div className="flex flex-row">
            <Avatar>
              <AvatarImage src={user!.image.length > 2 ? user!.image : ""} />
              <AvatarFallback>
                {user!.image.length == 2 ? user!.image : <FaUser />}
              </AvatarFallback>
            </Avatar>
            <div className="self-center pl-5">
              <p>{user?.name}</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
