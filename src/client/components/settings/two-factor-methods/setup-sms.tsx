import { MdNewLabel } from "react-icons/md";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

const SetupSMS = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-52" variant={"outline"}>
          Setup SMS
          <span className="pl-3">
            <MdNewLabel size={25} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default SetupSMS;
