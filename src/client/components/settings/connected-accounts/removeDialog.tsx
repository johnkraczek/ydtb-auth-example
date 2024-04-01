import { FaRegTrashAlt } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

export const UnlinkProviderDialog = ({
  provider,
  display,
  onConfirm,
}: {
  provider: string;
  display: string;
  onConfirm: (provider: string) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {/* <Button asChild>
          <div>
            <span className="pr-1">Remove</span>
            <FaRegTrashAlt />
          </div>
        </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Are you sure you want to unlink ${display}?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently unlink your ${provider} account from this YDTB account.
            You will need to relink this provider if you would like to login
            with it in the future.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(provider)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
