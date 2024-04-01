import { FaRegTrashAlt } from "react-icons/fa";
import { TbTrashOff } from "react-icons/tb";
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

export const Unlink2FADialog = ({
  alertTitle,
  alertMessage,
  onConfirm,
  disabled = false,
}: {
  alertTitle: string;
  alertMessage: string;
  onConfirm: () => void;
  disabled?: boolean;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled}>
        {!disabled ? (
          <Button className="w-52" asChild variant={"destructive"}>
            <div>
              Remove Method
              <span className="pl-2">
                <FaRegTrashAlt />
              </span>
            </div>
          </Button>
        ) : (
          <Button
            className="w-52 cursor-not-allowed"
            asChild
            variant={"success"}
          >
            <div>
              Primary 2FA
              <span className="pl-2">
                <TbTrashOff size={20} />
              </span>
            </div>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
