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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Arrow } from "@radix-ui/react-tooltip";

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
      <TooltipProvider>
        <AlertDialogTrigger disabled={!disabled}>
          {disabled ? (
            <Button className="w-52" asChild variant={"destructive"}>
              <div>
                Remove
                <span className="pl-2">
                  <FaRegTrashAlt />
                </span>
              </div>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Can't Remove your last 2FA method.</p>
                <Arrow className="TooltipArrow" />
              </TooltipContent>
            </Tooltip>
          )}
        </AlertDialogTrigger>
      </TooltipProvider>
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
