import { useEffect, useState, useTransition } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiMailAddLine } from "react-icons/ri";
import { toast } from "sonner";
import { Button } from "~/client/components/ui/button";
import { Skeleton } from "~/client/components/ui/skeleton";
import { useCurrentUser } from "~/client/hooks/use-current-user";
import { userHasTwoFactorType } from "~/server/data/two-fa-methods";
import { TWO_FA_TYPE } from "~/server/db/schemas/users/two-factor-methods";

export const SMS2FaButton = () => {
  const [hasEmail, setHasEmail] = useState<string | false | null>(null);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const fetchSMSStatus = () => {
    startTransition(async () => {
      const result = await userHasTwoFactorType({
        type: TWO_FA_TYPE.SMS,
      });
      setHasEmail(result);
    });
  };

  useEffect(fetchSMSStatus, []);

  const handleEmailLink = async () => {
    if (user) {
      //   await addEmailTwoFactor({ userID: user?.id! });
      //   fetchSMSStatus();
      toast("This will be a future lesson");
    }
  };

  if (hasEmail === null || isPending) {
    return <Skeleton className="h-[36px] w-[200px]" />;
  }

  if (hasEmail === false) {
    return (
      <Button className="w-52" onClick={handleEmailLink}>
        Add SMS 2FA
        <span className="pl-2">
          <RiMailAddLine size={15} />
        </span>
      </Button>
    );
  }

  if (typeof hasEmail === "string") {
    return (
      <Button asChild className="w-52" variant={"success"}>
        <div>
          SMS 2FA Active
          <span className="pl-2">
            <MdOutlineMarkEmailRead size={15} />
          </span>
        </div>
      </Button>
    );
  }
};
